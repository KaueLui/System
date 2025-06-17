import { Node } from './Node';

export class LinkedList<T extends { id: string }> { 
    private head: Node<T> | null; 
    private tail: Node<T> | null; 
    private _size: number;      

    constructor() {
        this.head = null;
        this.tail = null;
        this._size = 0;
    }

    get size(): number {
        return this._size;
    }

    public append(value: T): void {
        const newNode = new Node(value);
        if (!this.head) { 
            this.head = newNode;
            this.tail = newNode;
        } else {
            this.tail!.next = newNode; 
            this.tail = newNode;       
        }
        this._size++;
    }

    public findById(id: string): T | null {
        let current = this.head; 
        while (current) {
            if (current.value.id === id) {
                return current.value; 
            }
            current = current.next; 
        }
        return null; 
    }

    public removeById(id: string): T | null {
        if (!this.head) {
            return null; 
        }

        if (this.head.value.id === id) {
            const removedValue = this.head.value;
            this.head = this.head.next; 
            if (!this.head) { 
                this.tail = null;
            }
            this._size--;
            return removedValue;
        }

        let current: Node<T> | null = this.head;
        let prev: Node<T> | null = null; 

        while (current && current.value.id !== id) {
            prev = current;
            current = current.next;
        }

        if (current) { 
            prev!.next = current.next; 
            if (!current.next) { 
                this.tail = prev; 
            }
            this._size--;
            return current.value;
        }

        return null;
    }

    public updateById(id: string, newValue: Partial<T>): T | null {
        let current: Node<T> | null = this.head;
        while (current) {
            if (current.value.id === id) {
                Object.assign(current.value, newValue);
                return current.value;
            }
            current = current.next;
        }
        return null; 
    }

    public toArray(): T[] {
        const elements: T[] = [];
        let current = this.head;
        while (current) {
            elements.push(current.value);
            current = current.next;
        }
        return elements;
    }

    public clear(): void {
        this.head = null;
        this.tail = null;
        this._size = 0;
    }

    public insertSorted(value: T, compareFn: (a: T, b: T) => number): void {
        const newNode = new Node(value);

        if (!this.head || compareFn(value, this.head.value) < 0) {
            newNode.next = this.head;
            this.head = newNode;
            if (!this.tail) { 
                this.tail = newNode;
            }
            this._size++;
            return;
        }

        let current: Node<T> | null = this.head;
        let prev: Node<T> | null = null;

        while (current && compareFn(value, current.value) >= 0) {
            prev = current;
            current = current.next;
        }

        newNode.next = current;
        prev!.next = newNode;
        if (!current) { 
            this.tail = newNode;
        }
        this._size++;
    }
}