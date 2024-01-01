import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:senior/Courses.dart';
import 'package:http/http.dart' as http;

class mainpage extends StatefulWidget {
  mainpage({Key? key}) : super(key: key);

  @override
  _mainpageState createState() {
    return _mainpageState();
  }
}

class _mainpageState extends State<mainpage> {
   int classId = -1;
  List classes =[];
  /// GEt DATA
  Future GetClass() async{
    var url= "http://localhost/Maarifah/class.php";
    var res = await http.get(Uri.parse(url));

    if(res.statusCode == 200){
      var red = json.decode(res.body);
      setState(() {
        classes.addAll(red);
      });
    }
  }

  /// Display pages option

  Color mainColor = Color(0xFF12203B);
  Color secondaryColor = Color(0xFFFF9E00);

  @override
  void initState() {
    super.initState();
    GetClass();
  }

  @override
  void dispose() {
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Maarifah",style: TextStyle(color: secondaryColor,fontWeight: FontWeight.bold),),
        backgroundColor:mainColor,),
      body: Container(
        margin: EdgeInsets.all(30),
          child: ListView(
              children: [
               RichText(text: TextSpan(
                 children: [
                   TextSpan(text: "Welcome To ",style: TextStyle(color: mainColor,fontSize: 18)),
                   TextSpan(text: "Ma'arifah ",style: TextStyle(color: secondaryColor,fontSize: 18,fontWeight: FontWeight.bold)),
                   TextSpan(text: "app. In our mobile app you will have many specifications that will make you able to learn all the Courses. ",style: TextStyle(color: mainColor,fontSize: 18,)),
                 ],
               )),
                SizedBox(height: 20,),
                Center(
                  child: Column(children: [
                    Text("Please Choose a class",style: TextStyle(color: mainColor,fontSize: 18,fontWeight: FontWeight.bold),),
                    SizedBox(height: 15,),
                    DropdownMenu(
                      width: 200,
                      dropdownMenuEntries:
                      classes.map<DropdownMenuEntry<Object>>( (e) {
                        return DropdownMenuEntry <Object> (value: e["class_id"],label:e["class_name"]);
                      }
                      ) .toList(),
                      onSelected: (c){
                        setState(() {
                          classId = int.parse(c.toString());
                        });
                      },
                    ),
                  SizedBox(height: 20,),
                  ElevatedButton(onPressed: (){
                    if(classId == -1){
                      showDialog(context: context, builder: (builder){
                        return AlertDialog(title: Text("Error"),content: Text("Please choose a class"));
                      });
                    }else{
                      Navigator.of(context).push(MaterialPageRoute(builder: (builder){
                        return courses(classId: classId.toString());
                      })
                      );
                    }
                  }, child: Icon(Icons.navigate_next,color: secondaryColor,weight: 400,),
                  style: ElevatedButton.styleFrom(
                  primary: mainColor,
                  ),),
                                ],)

                ),

              ],
          ),
      ),
    );
  }
}