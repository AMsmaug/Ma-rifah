import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:senior/Courses.dart';
import 'package:http/http.dart' as http;

class QA extends StatefulWidget {
  final String courseId;
  QA({required this.courseId ,Key? key}) : super(key: key);

  @override
  _QAState createState() {
    return _QAState();
  }
}

class _QAState extends State<QA> {
  List questionList = [];
  List chaptersName = [];
  List answers = [];
  String msg = "";

  Future GetQuestions(String chapterId) async{
    var url ="http://localhost/Maarifah/getQuestions.php";
    var res = await http.post(Uri.parse(url), body: {
       'chapterId' : chapterId,
    },);
    if (res.statusCode == 200) {
      print("Data sent successfully");
      print("Response: ${res.body}");
      var red = json.decode(res.body);
      setState(() {
        questionList.addAll(red);
      });
      print(red);
    } else {
      print("Failed to send data. Status code: ${res.statusCode}");
    }
  }
  Future getChaptersName(String courseId) async{
    var url ="http://localhost/Maarifah/getChapters.php";
    var res = await http.post(Uri.parse(url), body: {'data': courseId},);
    if (res.statusCode == 200) {
      print("Data sent successfully");
      print("Response: ${res.body}");
      var red = json.decode(res.body);
      setState(() {
          chaptersName.addAll(red);
      });
    } else {
      print("Failed to send data. Status code: ${res.statusCode}");
    }
  }
  Future GetAnswers(String questionId) async{
    var url ="http://localhost/Maarifah/getAnswers.php";
    var res = await http.post(Uri.parse(url), body: {
      'questionId' : questionId,
    },);
    if (res.statusCode == 200) {
      print("Data sent successfully");
      print("Response: ${res.body}");
      var red = json.decode(res.body);
      setState(() {
        answers.addAll(red);
      });
      print(red);
    } else {
      print("Failed to send data. Status code: ${res.statusCode}");
    }
  }

  void seeAnswers(String questionId) async {
    await GetAnswers(questionId);
    showDialog(
      context: context,
      builder: (builder) {
        if (answers.length == 0) {
          return AlertDialog(
            title: Text("Answers"),
            content: Text("No Answers are found"),
          );
        } else {
          return AlertDialog(
            title: Text("Answers",style: TextStyle(color: secondaryColor,fontWeight: FontWeight.bold),),
            content: SingleChildScrollView(
                child: Column(
                  children: List.generate(
                    answers.length,
                        (j) => Column(
                      mainAxisAlignment: MainAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Icon(Icons.person, color: secondaryColor, size: 20,),
                            SizedBox(width: 15,),
                            Text(
                              "${answers[j]["student_name"]}",
                              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: mainColor,fontStyle: FontStyle.italic),
                            ),
                            SizedBox(height: 30,),
                          ],
                        ),
                        Row(
                          children: [
                            SizedBox(width: 40,),
                            SizedBox(
                              width: 200, // Adjust the width as needed
                              child: Text(
                                "${answers[j]["answer_content"]}",
                                style: TextStyle(color: mainColor, fontSize: 16,),
                              ),
                            ),

                          ],
                        ),
                        Row(children: [SizedBox(height: 20,)],)
                      ],
                    ),
                  ),
                ),
            ),
          );
        }
      },
    );
  }



  ///Colors used
  Color mainColor = Color(0xFF12203B);
  Color secondaryColor = Color(0xFFFF9E00);

  @override
  void initState(){
    super.initState();
    getChaptersName(widget.courseId).then((_) {
      if (chaptersName.isNotEmpty) {
        GetQuestions(chaptersName[0]["chapter_id"]);
        setState(() {
          msg = "Chapter ${chaptersName[0]["chapter_number"]}";
        });
      }
    });
  }
  @override
  Widget build(BuildContext context) {

    String courseName = ModalRoute.of(context)!.settings.arguments as String;
    return Scaffold(
      //appBar
        appBar: AppBar(title: Text("Q&A - $courseName $msg",style: TextStyle(color: secondaryColor,fontWeight: FontWeight.bold)),backgroundColor: mainColor),
      //Drawer
      drawer: Drawer(
          elevation: 5,
          child: ListView.builder(itemBuilder: (itemBuilder,position){
            return Card(
              elevation: 5,
              color : mainColor,
              child: ListTile(
                title: Text("Chapter : ${chaptersName[position]["chapter_number"]}",style: TextStyle(color: Colors.white,fontWeight: FontWeight.bold,fontSize: 18),),
                subtitle: Text(chaptersName[position]["chapter_name"],style: TextStyle(color: secondaryColor,fontWeight: FontWeight.bold,fontSize: 14),),
                onTap: (){
                      questionList = [];
                      GetQuestions(chaptersName[position]["chapter_id"]);
                      setState(() {
                        msg = "Chapter ${chaptersName[position]["chapter_number"]}";
                        print("msg updated: $msg");
                      });
                      Navigator.pop(context);

                },),
            );
          },itemCount: chaptersName.length,),
        ),

      body: Container(
        child: Column(
          children: [
            Expanded(
                child:ListView.builder(itemBuilder: (itemBuilder,i){
                  return Card(
                      margin: EdgeInsets.all(15),
                      elevation: 5,
                      shadowColor: mainColor,
                      child:Column(
                          children: [
                            SizedBox(height: 10,),
                            Row(
                              children: [
                                SizedBox(width: 15,),
                                Icon(Icons.person,color: mainColor,size: 20,),
                                SizedBox(width: 15,),
                                Text("${questionList[i]["student_name"]}", style: TextStyle(fontSize: 18,fontWeight: FontWeight.bold,color: mainColor)),
                              ],
                            ),
                            SizedBox(height: 15,),
                            Row(children: [SizedBox(width: 20,),Text("${questionList[i]["question_content"]}",style: TextStyle(color: mainColor,fontSize: 17),),],),
                            SizedBox(height: 5,),
                            Image.asset(
                              "${questionList[i]["image_url"].toString().replaceAll("../../../public", "assets")}",
                              width: 300, // Set the width as per your requirement
                              height: 300, // Set the height as per your requirement
                            ),
                            Row(mainAxisAlignment: MainAxisAlignment.start,children: [
                              SizedBox(width: 15,),
                              ElevatedButton(onPressed: ()async{
                                answers =[];

                                seeAnswers(questionList[i]["question_id"]);
                              }, child: Text("See Answers",style: TextStyle(color: secondaryColor,fontWeight: FontWeight.bold),),
                                style: ButtonStyle(
                                  backgroundColor: MaterialStateProperty.all<Color>(mainColor), // Set the background color
                                ),),

                            ],),
                            SizedBox(height: 10,)
                          ]));

                },itemCount: questionList.length,),
            ),
          ],
        )
      ),

      bottomNavigationBar: BottomAppBar(
        color: mainColor, // Customize the color of the BottomAppBar
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceAround,
          children: [
            IconButton(
              icon: Icon(Icons.arrow_back_outlined,color: secondaryColor,),
              onPressed: () {
                Navigator.of(context).pop(MaterialPageRoute(builder: (builder){
                  return courses(classId: "none",);
                }));
              },
            ),
          ],
        ),
      ),
    );
  }
}
