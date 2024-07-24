import { SourceLocation } from './grammar/ast';

export class CompilationError extends Error {
    name: string = 'CompilationError';
    location: SourceLocation;

    constructor(message: string, location: SourceLocation) {
        super(message);
        this.location = location;
    }

    toString(): string {
        return `${this.name}: ${this.message}\n${this.location.interval.getLineAndColumnMessage()}`;
    }
}

export class ParseError extends CompilationError {
    name: string = 'ParseError';
}

export class ResolveError extends CompilationError {
    name: string = 'ResolveError';
}

export class GenerationError extends CompilationError {
    name: string = 'GenerationError';
}

export class EmulationError extends CompilationError {
    name: string = 'EmulationError';
}
