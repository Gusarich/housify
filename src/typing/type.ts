export type Type =
    | { name: 'void' }
    | {
          name: 'int';
      }
    | {
          name: 'bool';
      }
    | {
          name: 'struct';
          fields: { name: string; type: Type }[];
      };
