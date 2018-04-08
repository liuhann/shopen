
async function list (ctx, next) {
  let page = parseInt(ctx.request.query.page) || 1
  let count = parseInt(ctx.request.query.count) || 10
  
  let sort = ctx.request.query.sort
  let order = ctx.request.query.order
  
  let filter = ctx.request.query.filter
  let value = ctx.request.query.value
  
  const cursor = this.mongodb.collection(this.collectionName).find(request.body);
  const total = await cursor.count(false);
  
  if (sort) {
    cursor.sort(sort);
  }
  /*
          for(const key in request.body) {
              if (request.body[key] === true) {
                  request.body[key] = {
  
                  }
              }
          }*/
  
  const list = await cursor.skip((page-1) * count).limit(count).toArray();
  response.send({
    page,
    total,
    list,
    count
  })
}

module.exports = {
  list
}
