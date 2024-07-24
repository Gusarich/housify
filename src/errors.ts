import { SourceLocation } from './grammar/ast';

export class CompilationError extends Error {
    name: string = 'CompilationError';
    location?: SourceLocation;

    constructor(message: string, location?: SourceLocation) {
        super(message);
        this.location = location;
    }

    toString(): string {
        if (this.location) {
            return `${this.location.interval.getLineAndColumnMessage()}\n${this.name}: ${this.message}`;
        } else {
            return `${this.name}: ${this.message}`;
        }
    }
}

export class InternalError extends CompilationError {
    name: string = 'InternalError';
}

export class ParseError extends CompilationError {
    name: string = 'ParseError';

    constructor(message: string, location: SourceLocation) {
        super(message, location);
    }

    toString(): string {
        // errors from ohm-js already include the location
        // we might want to handle this differently in the future
        return this.message;
    }
}

export class ResolveError extends CompilationError {
    name: string = 'ResolveError';

    constructor(message: string, location: SourceLocation) {
        super(message, location);
    }
}

export class ConstantEvaluationError extends CompilationError {
    name: string = 'ConstantEvaluationError';
    fatal: boolean = false;

    constructor(
        message: string,
        location: SourceLocation,
        fatal: boolean = false,
    ) {
        super(message, location);
        this.fatal = fatal;
    }
}

export class GenerationError extends CompilationError {
    name: string = 'GenerationError';

    constructor(message: string, location: SourceLocation) {
        super(message, location);
    }
}

export class EmulationError extends CompilationError {
    name: string = 'EmulationError';
}
