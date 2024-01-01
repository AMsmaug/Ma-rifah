  import 'dart:convert';
  
  import 'package:flutter/material.dart';
  import 'package:http/http.dart' as http;
  import 'package:senior/Content.dart';
  import 'package:senior/Q&A.dart';
  
  import 'MainPage.dart';
  
  class courses extends StatefulWidget {
    final String classId;
    courses({required this.classId ,Key? key}) : super(key: key);
    @override
    _coursesState createState() {
      return _coursesState();
    }
  }
  
  class _coursesState extends State<courses> {
     late String className;
     late int nbChaps;
     List courses =[];
     Color mainColor = Color(0xFF12203B);
     Color secondaryColor = Color(0xFFFF9E00);
  
  
    Future<void> getCourses(String classID) async {
      final url = Uri.parse("http://localhost/Maarifah/course.php");
      final response = await http.post(url, body: {'data': classID},
      );
      if (response.statusCode == 200) {
        print("Data sent successfully");
        print("Response: ${response.body}");
        var red = json.decode(response.body);
        setState(() {
          courses.addAll(red);
        });
      } else {
        print("Failed to send data. Status code: ${response.statusCode}");
      }
    }
    ///GET CLASSNAME
    Future<void> getClassName(String classID) async {
      final url = Uri.parse("http://localhost/Maarifah/getClassName.php");
      final response = await http.post(url, body: {'data': classID},
      );
      if (response.statusCode == 200) {
        print("Data sent successfully");
        print("Response: ${response.body}");
        var red = json.decode(response.body);
        setState(() {
          className = red["class_name"];
        });
      } else {
        print("Failed to send data. Status code: ${response.statusCode}");
      }
    }
    ///Get Chapters Numbers
     Future<int> getNbChapters(String courseId) async {
       final url = Uri.parse("http://localhost/Maarifah/nbChapters.php");
       final response = await http.post(url, body: {'data': courseId},
       );
       if (response.statusCode == 200) {
         print("Data sent successfully");
         print("Response: ${response.body}");
         var red = json.decode(response.body);
         setState(() {
           nbChaps = red;
         });
       } else {
         print("Failed to send data. Status code: ${response.statusCode}");
       }
       return nbChaps;
     }
  void displayPages (String courseId,String courseName) {
    showDialog(context: context, builder: (builder) {
      return AlertDialog(
        content: Column(
          children: [
            Card(
              elevation: 5,
              color: Colors.white,
              child: ListTile(
                leading: CircleAvatar(
                  backgroundColor: secondaryColor,
                  child: Icon(Icons.question_mark, color: mainColor,),
                ),
                title: Text("Question And Answers Page",
                  style: TextStyle(color: mainColor),),
                subtitle: Text(
                    "Page contains question and answers about specific material"),
                onTap: () {
                  Navigator.pop(context);
                  Navigator.of(context).push(
                      MaterialPageRoute(builder: (builder) {
                        return QA(courseId: courseId);
                      }, settings: RouteSettings(arguments: (courseName
                          .toString()))
                      ));
                },),
            ),
            SizedBox(height: 15,),
            Card(
              elevation: 5,
              color: Colors.white,
              child: ListTile(
                  leading: CircleAvatar(
                    backgroundColor: secondaryColor,
                    child: Icon(Icons.content_copy, color: mainColor,),
                  ),
                  title: Text(
                    "Courses Content", style: TextStyle(color: mainColor),),
                  subtitle: Text("Page contains content of specific material"),
                  onTap: () {
                    Navigator.pop(context);
                    Navigator.of(context).push(
                        MaterialPageRoute(builder: (builder) {
                          return content(courseId: courseId);
                        }, settings: RouteSettings(arguments: (courseName.toString()))
                        ));
                  }),
            ),
          ],
        ),
      );
    });
  }
  
     void showInfo(String crs, String id) async {
       try {
         int chps = await getNbChapters(id);
         String msg = "Number of Chapters is $chps";
         showDialog(context: context, builder: (builder) {
             return AlertDialog(
               title: Text("$crs Chapters", style: TextStyle(color: secondaryColor, fontWeight: FontWeight.bold),),
               content: Text("$msg", style: TextStyle(color: Colors.white)),
               backgroundColor: mainColor,
             );
           },
         );
       } catch (error) {
         print("Error fetching number of chapters: $error");
       }
     }
  
    @override
    void initState() {
      super.initState();
      getCourses(widget.classId);
      getClassName(widget.classId);
    }
  
    @override
    void dispose() {
      super.dispose();
    }
  
    @override
    Widget build(BuildContext context) {
      return Scaffold(
        appBar: AppBar(title: Text("Courses",style: TextStyle(color: secondaryColor,fontWeight: FontWeight.bold),)
          ,centerTitle: true,
          backgroundColor: mainColor,),
        body: Container(
          margin: EdgeInsets.only(top:30,left: 5,right: 5),
          child:ListView.builder(itemBuilder: (itemBuilder,position){
            return Card(
              elevation: 3,
              color: Colors.white,
              child: ListTile(
                leading: CircleAvatar(
                  backgroundColor: secondaryColor,
                  child: Icon(Icons.keyboard_arrow_right,color: mainColor,),
                ),
                title: Text("${courses[position]["course_name"]}",style: TextStyle(color: mainColor),),
                subtitle: Text("${className}"),
                trailing: IconButton(onPressed: (){
                      showInfo("${courses[position]["course_name"]}","${courses[position]["course_id"]}");
                }, icon: Icon(Icons.info,color: mainColor,)),
              onTap: (){
                  displayPages("${courses[position]["course_id"]}","${courses[position]["course_name"]}");
              },),
            );
          },itemCount: courses.length,)
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
                    return mainpage();
                  }));
                },
              ),
            ],
          ),
        ),
      );
    }
  }
