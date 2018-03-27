
export const typeSymbol = 'type';
export const tagSymbol = 'tag';

// export type hasType<A extends string> = {type: A};
// export type hasTag<A extends string> = {tag: A};
// export type hasTypeAndTag<A extends string = string, B extends string = string> = hasType<A> & hasTag<B>;

export abstract class HasTypeAndTag {
    static get [typeSymbol](): string {
        throw new Error(`${typeSymbol} is not implemented in abstract class HasTypeAndTag;
        it must be overriden by subclasses.`);
    }
    static get [tagSymbol](): string {
        throw new Error(`${tagSymbol} is not implemented in abstract class HasTypeAndTag;
        it must be overriden by subclasses.`);
    }
}
