/**
 * Remark plugin for inline annotations.
 *
 * Scans MDX AST for markers like [[term:key|display text]],
 * [[ref:key|display text]], and [[link:key|display text]].
 * Resolves them against a companion YAML file and replaces
 * them with <Annotation> component invocations.
 */

import { visit } from "unist-util-visit";
import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";

// Marker pattern: [[mode:key|display text]]
const MARKER_RE = /\[\[(term|ref|link):([a-z0-9_-]+)\|([^\]]+)\]\]/g;

// Map short mode names to Annotation component mode prop values
const MODE_MAP = {
  term: "term",
  ref: "reference",
  link: "link",
};

export default function remarkAnnotations() {
  return (tree, file) => {
    // Determine the MDX source file path
    const filePath = file.history?.[0];
    if (!filePath) return;

    // Look for companion YAML: [slug].annotations.yaml
    const dir = path.dirname(filePath);
    const basename = path.basename(filePath, path.extname(filePath));
    const yamlPath = path.join(dir, `${basename}.annotations.yaml`);

    if (!fs.existsSync(yamlPath)) return;

    let annotations;
    try {
      const yamlContent = fs.readFileSync(yamlPath, "utf-8");
      annotations = yaml.load(yamlContent);
    } catch (e) {
      console.warn(`[remark-annotations] Failed to parse ${yamlPath}: ${e.message}`);
      return;
    }

    if (!annotations) return;

    // Build lookup maps: { key -> annotation data }
    const termMap = new Map();
    const refMap = new Map();
    const linkMap = new Map();

    for (const t of annotations.terms || []) {
      termMap.set(t.key, t);
    }
    for (const r of annotations.references || []) {
      refMap.set(r.key, r);
    }
    for (const l of annotations.links || []) {
      linkMap.set(l.key, l);
    }

    let hasAnnotations = false;

    // Walk all text nodes looking for markers
    visit(tree, "text", (node, index, parent) => {
      if (!parent || index === undefined) return;

      const text = node.value;
      if (!text.includes("[[")) return;

      const parts = [];
      let lastIndex = 0;

      for (const match of text.matchAll(MARKER_RE)) {
        const [fullMatch, modeShort, key, displayText] = match;
        const matchStart = match.index;

        // Text before the marker
        if (matchStart > lastIndex) {
          parts.push({
            type: "text",
            value: text.slice(lastIndex, matchStart),
          });
        }

        const mode = MODE_MAP[modeShort];
        let annotationData = null;
        let resolved = true;

        if (modeShort === "term") {
          annotationData = termMap.get(key);
        } else if (modeShort === "ref") {
          annotationData = refMap.get(key);
        } else if (modeShort === "link") {
          annotationData = linkMap.get(key);
        }

        if (!annotationData) {
          console.warn(`[remark-annotations] Unresolved annotation key: ${modeShort}:${key} in ${basename}.mdx`);
          resolved = false;
        }

        if (resolved) {
          hasAnnotations = true;

          // Build the content prop object based on mode
          let contentObj;
          if (modeShort === "term") {
            contentObj = { definition: annotationData.definition?.trim() || "" };
          } else if (modeShort === "ref") {
            contentObj = {
              title: annotationData.title || "",
              authors: annotationData.authors || "",
              year: annotationData.year || undefined,
              venue: annotationData.venue || undefined,
              url: annotationData.url || undefined,
              summary: annotationData.summary?.trim() || "",
              context: annotationData.context?.trim() || undefined,
            };
            // Remove undefined/null fields
            Object.keys(contentObj).forEach((k) => {
              if (contentObj[k] === undefined || contentObj[k] === null) {
                delete contentObj[k];
              }
            });
          } else {
            // link
            contentObj = {
              url: annotationData.url || "",
              title: annotationData.title || "",
              source: annotationData.source || "",
              summary: annotationData.summary?.trim() || "",
            };
          }

          // Build JSX expression for the Annotation component
          // We emit an mdxJsxFlowElement or mdxJsxTextElement
          const annotationNode = {
            type: "mdxJsxTextElement",
            name: "Annotation",
            attributes: [
              {
                type: "mdxJsxAttribute",
                name: "mode",
                value: mode,
              },
              ...(modeShort === "term"
                ? [
                    {
                      type: "mdxJsxAttribute",
                      name: "term",
                      value: annotationData.pattern || displayText,
                    },
                  ]
                : []),
              {
                type: "mdxJsxAttribute",
                name: "content",
                value: {
                  type: "mdxJsxAttributeValueExpression",
                  value: JSON.stringify(contentObj),
                  data: {
                    estree: {
                      type: "Program",
                      sourceType: "module",
                      body: [
                        {
                          type: "ExpressionStatement",
                          expression: valueToEstree(contentObj),
                        },
                      ],
                    },
                  },
                },
              },
              {
                type: "mdxJsxAttribute",
                name: "client:visible",
                value: null,
              },
            ],
            children: [{ type: "text", value: displayText }],
          };

          parts.push(annotationNode);
        } else {
          // Unresolved: just render the display text
          parts.push({ type: "text", value: displayText });
        }

        lastIndex = matchStart + fullMatch.length;
      }

      // Text after the last marker
      if (lastIndex < text.length) {
        parts.push({ type: "text", value: text.slice(lastIndex) });
      }

      if (parts.length > 0 && lastIndex > 0) {
        parent.children.splice(index, 1, ...parts);
        return index + parts.length;
      }
    });

    // Auto-inject import if annotations were found
    if (hasAnnotations) {
      const importNode = {
        type: "mdxjsEsm",
        value: `import { Annotation } from '../../components/islands/shared/Annotation.tsx';`,
        data: {
          estree: {
            type: "Program",
            sourceType: "module",
            body: [
              {
                type: "ImportDeclaration",
                specifiers: [
                  {
                    type: "ImportSpecifier",
                    imported: { type: "Identifier", name: "Annotation" },
                    local: { type: "Identifier", name: "Annotation" },
                  },
                ],
                source: {
                  type: "Literal",
                  value: "../../components/islands/shared/Annotation.tsx",
                  raw: "'../../components/islands/shared/Annotation.tsx'",
                },
              },
            ],
          },
        },
      };

      // Insert at the top of the tree (after any existing imports)
      tree.children.unshift(importNode);
    }
  };
}

/**
 * Convert a JS value into an ESTree expression node.
 * Handles strings, numbers, booleans, null, undefined, arrays, and objects.
 */
function valueToEstree(value) {
  if (value === null || value === undefined) {
    return { type: "Literal", value: null, raw: "null" };
  }
  if (typeof value === "string") {
    return { type: "Literal", value, raw: JSON.stringify(value) };
  }
  if (typeof value === "number") {
    return { type: "Literal", value, raw: String(value) };
  }
  if (typeof value === "boolean") {
    return { type: "Literal", value, raw: String(value) };
  }
  if (Array.isArray(value)) {
    return {
      type: "ArrayExpression",
      elements: value.map(valueToEstree),
    };
  }
  if (typeof value === "object") {
    return {
      type: "ObjectExpression",
      properties: Object.entries(value).map(([k, v]) => ({
        type: "Property",
        key: { type: "Identifier", name: k },
        value: valueToEstree(v),
        kind: "init",
        method: false,
        shorthand: false,
        computed: false,
      })),
    };
  }
  return { type: "Literal", value: null, raw: "null" };
}
