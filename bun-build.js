await Bun.build({
    entrypoints: ['./src/'],
    outdir: './build',
    target: 'node',
});