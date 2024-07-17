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
          fields: { name: string; type: Type }[];
      };
