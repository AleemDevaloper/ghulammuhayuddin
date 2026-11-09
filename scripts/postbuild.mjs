import { copyFile, mkdir, readdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

await copyFile('dist/index.html', 'dist/404.html');
await writeFile('dist/.nojekyll', '');

async function copySiteToRepositoryRoot(source = 'dist', destination = '.') {
  for (const entry of await readdir(source, { withFileTypes: true })) {
    const sourcePath = resolve(source, entry.name);
    const destinationPath = resolve(destination, entry.name);

    if (entry.isDirectory()) {
      await mkdir(destinationPath, { recursive: true });
      await copySiteToRepositoryRoot(sourcePath, destinationPath);
    } else if (entry.isFile()) {
      await copyFile(sourcePath, destinationPath);
    }
  }
}

await copySiteToRepositoryRoot();
