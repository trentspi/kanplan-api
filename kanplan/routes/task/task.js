var task = require('./task.schema.js');
var shortid = require('shortid');
var role = require('../role/role.schema.js');

module.exports = function(app) {
  app.get('/tasks/:orgId', function(req, res){
    task.find({'orgId':req.params.orgId, 'assignee':req.params.assignee},
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
    var currentTime = new Date();
    var state = (req.body.assignee == null ? "Open" : "Assigned");
    var taskId = shortid.generate();

    role.findOne({'orgId':req.params.orgId, 'userId':req.body.author}, {'role':true}).then(function(role,err) {
      if (err) {
        res.status(500).send(err);
      }

      if(role == null) {
        res.status(404).send("User does not exist");
      }
      if (role.role == 'admin') {
        task.create({
          title : req.body.title,
          description : req.body.description,
          compensation : req.body.compensation,
          author : req.body.author,
          orgId : req.params.orgId,
          assignee : req.body.assignee,
          state : state,
          timeWorked : 0,
          creationTime : currentTime,
          timeLog : {
            startTime : null,
            endTime : null
          },
          _id : taskId
        }).then(function(task, err) {
          if (err) {
            res.status(500).send(err);
          }
          res.json(task);
        });
      } else {
        res.status(401).send("User does not have proper role");
      }
    });
  });

  app.put('/task/:taskId', function (req, res) {
    task.findId(req.params.taskid).then(function (task, err) {
      if (err) {
        res.status(500).send(err);
      }
      if (task == null) {
        res.status(404).send("Task Id does not exist");
      }

      task.assignee = req.body.userId;
      task.state = "Assigned";

      task.save().then(function () {
        res.json(task);
      },
      function () {
        res.send(err);
      });
    });
  });

};
