/**
 * @author Feng Sheng Wu <idarkfox@qq.com>
 */
if( typeof(SerialCall) == "undefined" ){
    "use strict";
    window.SerialCall = function( /* auto */ context /* array */,task ,idx  ){
        var cidx = idx||0;
        if( typeof(task[idx]) == "undefined" ){
            return;
        }
        task[cidx](context,function(){
            SerialCall( context,task,++cidx );
        });
    }
    /*
    SerialCall(null,
        [
            function(context,next){
                call_one(next);
            }
            ,function(context,next){
                call_tow(next);
            }
            ,function(context,next){
                call_three();
            }
        ]
        ,0);
    */
}

if( typeof(TaskBegin) == "undefined" ){
    "use strict";
    window.TaskBegin = function(/* auto */ context ,/* obj  */ in_objs ){
        return new function(){
            var objs = in_objs||null;
            var task = [];
            this.append = function(funcNameOrFun,in_ms){
                var ms = in_ms||0;
                
                if( typeof(funcNameOrFun) == "string" ){
                    var arr = funcNameOrFun.split("->");
                    var obj = objs;
                    var names = [];
                    arr.forEach( function(ele,idx){
                        names.push(ele);
                        if( typeof(obj[ele])!="undefined" && idx != (arr.length -1) ){
                            obj = obj[ele];
                        } else {
                            if( typeof(obj[ele])!= "undefined" && idx == (arr.length -1) ){
                                if(ms){
                                    task.push(function(context,next){
                                        setTimeout( function(){
                                            obj[ele](next,context);
                                        },ms);
                                    });
                                } else {
                                    task.push(function(context,next){
                                        obj[ele](next,context);
                                    });
                                }
                            } else {
                                console.log( names.join(".") + " undefined!" );
                                return false;
                            }
                        }
                    });
                } else {
                    if( ms){
                        task.push(function(context,next){
                            setTimeout( function(){
                                funcNameOrFun(next,context);
                            },ms);
                        });
                    } else {
                        task.push(function(context,next){
                            funcNameOrFun(next,context);
                        });
                    }
    
                }
                return this;
            };
            this.insert = function(){};
            this.End = function(){
                SerialCall(context,task,0);
            };
        }
        
    }
    /*
        TaskBegin()
            .append( function(tNext){
                eleBack.className="back list flip out";
                tNext();
            },1000)
            .append( function(tNext){
                eleFront.className = "front list flip in";
                tNext();
            },175)
            .append( function(){
                (next||function(){})();
            },225)
        .End();
        
        
        TaskBegin(null,{scene:scene})
            .append("scene->hidPoker")
            .append(flip)
            .append("scene->showBullet")
            .append("scene->showPoker")
            .append(close_flip,1000/60 * (266/26))
        .End();
    */
}
