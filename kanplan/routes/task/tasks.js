var task = require('./task.schema.js');

module.exports = function(app) {
  app.get('/tasks/:orgId', function(req, res){
    task.find({'ordId':req.params.ordId, 'assignee':req.params.assignee},
    {
      author:true,
      title:true,
      description:true,
      state:true,
      compensation:true,
      timelog:true,
      time_worked:true
    }).then(function(task, err) {
      if(err){
        res.send(err);
      }
      res.json(task);
    });
  });

  app.post('/tasks/:orgId', function(req, res) {
    task.create({
      title : req.body.title,
      description : req.body.description,
      compensation : req.body.compensation,
      author : req.body.author,
      orgId : req.params.orgId
    })
  });
}
