const addSum = (a,b, callback) => {
    setTimeout(() => {
        if(typeof a !== 'number' || typeof b !== 'number') return callback('a, b must be numbers');
        callback(undefined, a+b)
    }, 3000);
}


addSum(10, 10, (error, sum) => {
    if(error) return console.log({error});
    console.log({sum});       
    addSum(sum, 15, (error, sum) => {
        if(error) return console.log({ error });
        console.log({ sum });
    })
});