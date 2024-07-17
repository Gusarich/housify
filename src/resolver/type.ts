import { AstExpression } from '../grammar/ast';

export type Type =
    | { type: 'void' }
    | {
          type: 'int';
      }
    | {
          type: 'bool';
      }
    | {
          type: 'struct';
          name: string;
          fields: { name: string; type: Type; defaultValue?: AstExpression }[];
      };
