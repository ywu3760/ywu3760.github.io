function arraysEqual(a1, a2)
{
    return JSON.stringify([...a1])==JSON.stringify([...a2]);
}

Array.prototype.shuffle = function shuffle()
{
    for (let i = this.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [this[i], this[j]] = [this[j], this[i]];
    }

    return this;
}

Array.prototype.freqOf = function freqOf(n)
{
    var f = 0;
    for (let i=0; i<this.length; i++)
        if (this[i] == n)
            f++;

    return f;
}

Array.prototype.index_es_Of = function index_es_Of(n)
{
    for (var i=0, idx=[]; i<this.length; i++)
        if (this[i] == n)
            idx.push(i);

    return idx;
}

Array.prototype.lastItem = function lastItem()
{
    return this[this.length - 1];
}

Array.prototype.randomItem = function randomItem()
{
    return this[randNum(0, this.length, 0)];
}

Array.prototype.doesContainArr = function doesContainArr(a)
{
    return a.every(i => this.includes(i));
}

function randNum(l, h, t)
{
    return Math.floor(Math.random() * (h - l + t)) + l;
}

function nextIdx(n, c, m)
{
    switch (n + c)
    {
        case -1:
            return m;
        case m + 1:
            return 0;
        default:
            return n + c;
    }
}

function medianOf(a, b)
{
    return (a + b)/2;
}