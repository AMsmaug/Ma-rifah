import 'dart:convert';
import 'package:flutter/material.dart';


import 'package:http/http.dart' as http;
import 'package:youtube_player_flutter/youtube_player_flutter.dart';


import 'Courses.dart';

class content extends StatefulWidget {
  final String courseId;
  content({required this.courseId ,Key? key}) : super(key: key);

  @override
  _contentState createState() {
    return _contentState();
  }
}

class _contentState extends State<content> {
  late YoutubePlayerController controller;
  List chaptersName = [];
  List content =[];
  String msg = "";
  Color mainColor = Color(0xFF12203B);
  Color secondaryColor = Color(0xFFFF9E00);
  List urlAndDesc =[];

  ///Get Chapter Names
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
  Future getContent(String chapterId) async{
    var url ="http://localhost/Maarifah/getContent.php";
    var res = await http.post(Uri.parse(url), body: {'chapterId': chapterId},);
    if (res.statusCode == 200) {
      print("Data sent successfully");
      print("Response: ${res.body}");
      var red = json.decode(res.body);
      setState(() {
        content.addAll(red);
      });
      print(content);
    } else {
      print("Failed to send data. Status code: ${res.statusCode}");
    }
  }
  // Style the content
  TextStyle getStyleForElementType(String elementType) {
    switch (elementType) {
      case "paragraph":
        return TextStyle(
          // Add your paragraph styles here
          fontSize: 16,
          fontWeight: FontWeight.normal,
          color: mainColor,
          height: 1.4,
        );
      case "title" :
      return TextStyle(
        // Add your paragraph styles here
        fontSize: 18,
        fontWeight: FontWeight.bold,
        color: secondaryColor,
      );
      case "example" :
        return TextStyle(
          // Add your paragraph styles here
          fontSize: 16,
          fontWeight: FontWeight.bold,
          color: mainColor,
        );
      case "list" :
        return TextStyle(
          // Add your paragraph styles here
          fontSize: 16,
          fontWeight: FontWeight.bold,
          color: mainColor,
          height: 1.6,
        );
      default:
      // Default style
        return TextStyle(
          fontSize: 14,
          fontWeight: FontWeight.normal,
          color: Colors.red,
        );
    }
  }
  void displayDescription() {
    showDialog(
      context: context,
      builder: (builder) {
        String url = urlAndDesc[0];
        String desc = urlAndDesc[1];
        controller =YoutubePlayerController(
          initialVideoId: YoutubePlayer.convertUrlToId(url)!,
          flags: const YoutubePlayerFlags(
            mute: true,
            loop: false,
            autoPlay: false,
          ),
        );



        return AlertDialog(
          title: Text(
            "Chapter Description",
            style: TextStyle(color: secondaryColor, fontSize: 22, fontWeight: FontWeight.bold),
          ),
          content: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              YoutubePlayer(
                controller: controller,
                liveUIColor: Colors.amber, // Customize live UI color if needed
              ),
              SizedBox(height: 20),
              Text("$desc", style: TextStyle(color: mainColor, fontSize: 18)),
               ],
          ),
        );
      },
    );
  }

//OnLoad
  @override
  void initState() {
    super.initState();
    getChaptersName(widget.courseId).then((_) {
      if (chaptersName.isNotEmpty) {
        getContent(chaptersName[0]["chapter_id"]);
        setState(() {
          msg = "Explanation - Chapter ${chaptersName[0]["chapter_number"]}";
          urlAndDesc.add(chaptersName[0]["video_url"]);
          urlAndDesc.add(chaptersName[0]["description"]);
        });
      }
    });
  }

  @override
  void dispose() {
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
          title: Text("$msg",style: TextStyle(color: secondaryColor,fontWeight: FontWeight.bold))
          ,backgroundColor: mainColor,
        actions: [
          ElevatedButton(
              onPressed: () {
                  displayDescription();
              },
              style: ButtonStyle(
              backgroundColor: MaterialStateProperty.all<Color>(mainColor), // Set the background color
            ),
              child: Text('Description',style: TextStyle(color: secondaryColor),),
          ),
        ],
      ),
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
                content = [];
                urlAndDesc=[];
                Navigator.pop(context);
                getContent(chaptersName[position]["chapter_id"]);
                setState(() {
                  msg = "Explanation - Chapter ${chaptersName[position]["chapter_number"]}";
                  urlAndDesc.add(chaptersName[position]["video_url"]);
                  urlAndDesc.add(chaptersName[position]["description"]);
                });
              },),
          );
        },itemCount: chaptersName.length,),
      ),
      body: Container(
        padding: EdgeInsets.all(20),
        child: Column(
          children: [
            Expanded(
                child: ListView.builder(itemBuilder: (itemBuilder,i){
              return Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text("${content[i]["content"]}",style: getStyleForElementType("${content[i]["type"]}"),),
                  SizedBox(height: 15,)
                ],
              );
            },itemCount: content.length,))
          ],
        ),
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