export class Item {
    private name: string;
    private id: number;
    private price: number;


    constructor(name: string, id: number, price: number) {
        this.name = name;
        this.id = id;
        this.price = price;
    }

    public getName(): string {
        return this.name;
    }

    public getId(): number {
        return this.id;
    }

    public getPrice(): number {
        return this.price;
    }

    public setName(name: string): void {
        this.name = name;
    }

    public setId(id: number): void {
        this.id = id;
    }

    public setPrice(price: number): void {
        this.price = price;
    }
}