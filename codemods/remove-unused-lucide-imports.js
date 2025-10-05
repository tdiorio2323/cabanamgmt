/**
 * Removes unused named imports from 'lucide-react'.
 * Works with TS/TSX. Safe to run multiple times.
 */
export default function transformer(file, api) {
  const j = api.jscodeshift;
  const root = j(file.source);

  root.find(j.ImportDeclaration, { source: { value: 'lucide-react' } }).forEach(path => {
    const node = path.value;
    if (!node.specifiers || node.specifiers.length === 0) return;

    const used = [];
    const unused = [];

    node.specifiers.forEach(spec => {
      if (!spec.imported) return; // skip strange/default cases
      const localName = spec.local ? spec.local.name : spec.imported.name;

      // count all uses except the import itself
      const idCount =
        root.find(j.Identifier, { name: localName }).filter(p => p.parentPath.value !== spec).size() +
        root.find(j.JSXIdentifier, { name: localName }).size();

      (idCount > 0 ? used : unused).push(spec);
    });

    // if none used, remove whole import
    if (used.length === 0) {
      j(path).remove();
      return;
    }

    // otherwise keep only used
    node.specifiers = used;
  });

  return root.toSource({ quote: 'single', trailingComma: true });
}
