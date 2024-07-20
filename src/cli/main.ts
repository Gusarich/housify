#!/usr/bin/env node

import { Command } from 'commander';
import * as fs from 'fs';
import * as path from 'path';
import { compile } from '../compile';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pkg = require('../../package.json');

const program = new Command();

program
    .name('Housify CLI')
    .description('Compile Housify modules to JSON')
    .version(pkg.version);

program
    .argument('<filepath>', 'Path to the Housify module file')
    .option('-o, --output <output>', 'Output file path')
    .action((filepath, options) => {
        const fileNameWithoutExtension = path.join(
            path.dirname(filepath),
            path.basename(filepath, '.hsf'),
        );
        const outputFilePath =
            options.output || `${fileNameWithoutExtension}.json`;
        processFile(filepath, outputFilePath);
    });

program.parse(process.argv);

function processFile(inputPath: string, outputPath: string) {
    if (!fs.existsSync(inputPath)) {
        console.error(`Error: The file ${inputPath} does not exist.`);
        process.exit(1);
    }

    const source = fs.readFileSync(inputPath, 'utf8');

    const module = compile(source);

    fs.writeFileSync(outputPath, JSON.stringify(module, null, 4));
    console.log(`Result written to: ${outputPath}`);
}
