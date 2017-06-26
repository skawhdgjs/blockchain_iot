var mongoose = require('mongoose');


mongoose.connect('mongodb://localhost:27017/block');

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
// executed when the connection opens
db.once('open', function callback () {
	// add your code here when opening
  	console.log("open");
});

var blockSchema = mongoose.Schema({
   id : 'Number',
   prevHash : 'Number',
   header : 'Number',
   InnerPolicy : [{ Ipolicy : 'Number'}],
   OuterPolicy : [{ Opolicy : 'Number'}],
   transactions : [{ id : 'Number', header : 'Number'}],
   timestamp : 'date'

});

var Block = mongoose.model('Block', blockSchema);

var block1 = new Block({ id : 3, prevHash : 2 , InnerPolicy : { Ipolicy : 1},
    OuterPolicy : {OuterPolicy : 5}, Transaction : { id : 10, header :30},

})

block1.save(function (err,block1){
   console.log('haha');
})
/*
// 10. Block 레퍼런스 전체 데이터 가져오기
Block.find(function(error, Blocks){
    console.log('--- Read all ---');
    if(error){
        console.log(error);
    }else{
        console.log(Blocks);
    }
})

// 11. 특정 아이디값 가져오기
Block.findOne({_id:'585b777f7e2315063457e4ac'}, function(error,Block){
    console.log('--- Read one ---');
    if(error){
        console.log(error);
    }else{
        console.log(Block);
    }
});

// 12. 특정아이디 수정하기
Block.findById({_id:'585b777f7e2315063457e4ac'}, function(error,Block){
    console.log('--- Update(PUT) ---');
    if(error){
        console.log(error);
    }else{
        Block.name = '--modified--';
        Block.save(function(error,modified_Block){
            if(error){
                console.log(error);
            }else{
                console.log(modified_Block);
            }
        });
    }
});

// 13. 삭제
Block.remove({_id:'585b7c4371110029b0f584a2'}, function(error,output){
    console.log('--- Delete ---');
    if(error){
        console.log(error);
    }
    console.log('--- deleted ---');
});
*/
