import { SourceLocation } from './grammar/ast';

export class CompilationError extends Error {
    name: string = 'CompilationError';
    location: SourceLocation;

    constructor(message: string, location: SourceLocation) {
        super(message);
        this.location = location;
    }

    toString(): string {
        return `${this.location.interval.getLineAndColumnMessage()}\n${this.name}: ${this.message}`;
    }
}

export class InternalError extends CompilationError {
    name: string = 'InternalError';
}

export class ParseError extends CompilationError {
    name: string = 'ParseError';

    toString(): string {
        // errors from ohm-js already include the location
        // we might want to handle this differently in the future
        return this.message;
    }
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
