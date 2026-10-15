class PriorityQueue{
    #heap;
    #compare;
    
    constructor(compare){
        this.#heap = new Array();
        this.#compare = compare;
    }

    #swap(i, j){
        let tmp = this.#heap[i];
        this.#heap[i] = this.#heap[j];
        this.#heap[j] = tmp;
    }

    #parent(i){
        return Math.floor((i-1)/2);
    }

    #left(i){
        if (2*i+1 < this.size()) {
            return 2*i+1;
        }
        else {
            return i;
        }
    }

    #right(i){
        if (2*i+2 < this.size()) {
            return 2*i+2;
        }
        else {
            return i;
        }
    }

    #heapify(i) {
        let smallest = i;
        const left = 2 * i + 1;
        const right = 2 * i + 2;

        if (left < this.size() && this.#compare(this.#heap[left], this.#heap[smallest]) < 0) {
            smallest = left;
        }

        if (right < this.size() && this.#compare(this.#heap[right], this.#heap[smallest]) < 0) {
            smallest = right;
        }

        if (smallest !== i) {
            this.#swap(i, smallest);
            this.#heapify(smallest);
        }
    }

    size(){
        return this.#heap.length;
    }

    isEmpty(){
        return this.size() == 0;
    }

    push(x){
        let i = this.size();
        this.#heap.push(x);
        while (i > 0 && this.#compare(this.#heap[i], this.#heap[this.#parent(i)])<0) {
            this.#swap(i, this.#parent(i));
            i = this.#parent(i);
        }
    }

    top(){
        if (this.isEmpty()) return null;
        
        return this.#heap[0];
    }

    pop(){
        if (this.isEmpty()) return null;

        let root = this.#heap[0];
        this.#heap[0] = this.#heap[this.size()-1];

        this.#heap.pop();
        if (this.size() > 1) {
            this.#heapify(0);
        }
        return root;
    }

    contains(x){
        return this.#heap.includes(x);
    }

    decreaseKey(x) {
        let i = this.#heap.indexOf(x);
        while (i > 0 && this.#compare(this.#heap[i], this.#heap[this.#parent(i)])<0) {
            this.#swap(i, this.#parent(i));
            i = this.#parent(i);
        }
    }

    log(){
        for (let i in this.#heap) console.log(i, this.#heap[i]);
    }
}