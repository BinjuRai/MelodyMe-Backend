const Courses = require('../../models/admin/courses');
const Lesson = require('../../models/admin/lesson');

const mongoose = require('mongoose');
const { param } = require('../../routes/admin/coursesRoute');


exports.createCourse = async (req, res) => {
    try {
        const filename = req.file?.path
        
        const course = new Courses({ name: req.body.name, filepath: filename });
        await course.save();
        return res.status(201).json({
            success: true,
            message: "Created",
            data: course
        });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

exports.getAllCourses = async (req, res) => {
    try {
        const courses = await Courses.find();
        return res.json({ success: true, data: courses, message: "All Courses" });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

// exports.getCoursesById = async (req, res) => {
//     try {
//         const courses = await Courses.findById(req.params.id);
//         const lessons = await lesson.find({ courseId: new mongoose.Types.ObjectId(req.params.id) });


//         if (!courses) return res.status(404).json({ success: false, message: 'Courses not found' });
//         return res.json({ success: true, data: courses, lessons, message: "One courses" });
//     } catch (err) {
//         console.log(err);
//         return res.status(500).json({ success: false, message: "Server Error" });
//     }
// };

// Update a category
exports.updateCourses = async (req, res) => {
    try {
        const filename = req.file?.path
        const data = {
            name: req.body.name
        }
        if(filename){
            data.filepath = filename
        }
        const courses = await Courses.findByIdAndUpdate(
            req.params.id,
            data,
            { new: true }
        );
        if (!courses) return res.status(404).json({ success: false, message: 'Courses not found' });
        // return res.json({ success: true, data: Courses, message: "Updated" });
        return res.json({ success: true, data: courses, message: "Updated" });
    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: "Server Error" });
    }
};

exports.deleteCourse = async (req, res) => {
    try {
        const result = await Courses.findByIdAndDelete(req.params.id);
        if (!result) return res.status(404).json({ success: false, message: 'Courses not found' });
        return res.json({ success: true, message: 'Courses deleted' });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};


exports.getLessonsByCourseId = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate courseId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid course ID format' 
      });
    }

    // Find lessons and sort them (e.g., by order or createdAt)
    const lessons = await Lesson.find({ 
      courseId: new mongoose.Types.ObjectId(id) 
    }).sort({ order: 1 }); // or sort by another field like createdAt

    if (!lessons || lessons.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'No lessons found for this course' 
      });
    }

    // Optionally transform the data before sending
    const transformedLessons = lessons.map(lesson => ({
      id: lesson._id,
      title: lesson.title,
      duration: lesson.duration,
      // include other fields you need
      createdAt: lesson.createdAt,
      updatedAt: lesson.updatedAt
    }));

    res.status(200).json({ 
      success: true,
      count: lessons.length,
      data: transformedLessons,
      message: 'Lessons retrieved successfully'
    });

  } catch (error) {
    console.error("Error fetching lessons by courseId:", error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while fetching lessons',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// exports.getLessonsByCourseId = async (req, res) => {
//   try {
//     const courseId = req.params.id;

//     const courseLessons = await lessons.find({ courseId });

    

//     if (!courseLessons.length) {
//       return res.status(404).json({ message: 'No lessons found for this course' });
//     }

//     res.status(200).json(courseLessons);
//   } catch (error) {
//     console.error("Error fetching lessons by courseId:", error);
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };

// exports.getCoursesById = async (req, res) => {
//     try {
//         const courseId = req.params.id;
//         const course = await Courses.findById(courseId);

          
// const lessons = await lesson.find({ courseId: new mongoose.Types.ObjectId(req.params.id) });


//         if (!courses) return res.status(404).json({ success: false, message: 'Courses not found' });
//         return res.json({ success: true, data: courses, lessons, message: "One courses" });
//     } catch (err) {
//         console.log(err);
//         return res.status(500).json({ success: false, message: "Server Error" });
    

//         if (!course) {
//             return res.status(404).json({ success: false, message: 'Course not found' });
//         }

//         // Aggregate lessons to get totalPrice, authors, and durations
//         const aggregation = await lessons.aggregate([
//             { $match: { courseId: new mongoose.Types.ObjectId(courseId) } },
//             {
//                 $group: {
//                     _id: "$courseId",
//                     totalPrice: { $sum: "$price" },
//                     authorNames: { $addToSet: "$authorName" },
//                     totalDuration: { $push: "$duration" }
//                 }
//             }
//         ]);

//         const lessonData = aggregation[0] || {
//             totalPrice: 0,
//             authorNames: [],
//             totalDuration: []
//         };

//         // Calculate total duration from string durations like "1h 20m"
//         const totalMinutes = lessonData.totalDuration.reduce((acc, curr) => {
//             if (!curr) return acc;
//             let hours = 0, minutes = 0;

//             const hMatch = curr.match(/(\d+)\s*h/);
//             const mMatch = curr.match(/(\d+)\s*m/);

//             if (hMatch) hours = parseInt(hMatch[1]);
//             if (mMatch) minutes = parseInt(mMatch[1]);

//             return acc + hours * 60 + minutes;
//         }, 0);

//         const formattedDuration = `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`;

//         return res.json({
//             success: true,
//             data: {
//                 course,
//                 totalPrice: lessonData.totalPrice,
//                 authors: lessonData.authorNames,
//                 totalDuration: formattedDuration
//             },
//             message: "One course with aggregated lesson data"
//         });
//     } catch (err) {
//         console.log(err);
//         return res.status(500).json({ success: false, message: "Server Error" });
//     }
// };

exports.getCoursesById = async (req, res) => {
    try {
        const courseId = req.params.id;
        
        // Find the course
        const course = await Courses.findById(courseId);
        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }

        // Find all lessons for this course
        const lessons = await Lesson.find({ courseId: new mongoose.Types.ObjectId(courseId) });

        // Aggregate lesson data
        const aggregation = await Lesson.aggregate([
            { $match: { courseId: new mongoose.Types.ObjectId(courseId) } },
            {
                $group: {
                    _id: "$courseId",
                    totalPrice: { $sum: "$price" },
                    authorNames: { $addToSet: "$authorName" },
                    totalDuration: { $push: "$duration" }
                }
            }
        ]);

        const lessonData = aggregation[0] || {
            totalPrice: 0,
            authorNames: [],
            totalDuration: []
        };

        // Calculate total duration from string durations like "1h 20m"
        const totalMinutes = lessonData.totalDuration.reduce((acc, curr) => {
            if (!curr) return acc;
            let hours = 0, minutes = 0;

            const hMatch = curr.match(/(\d+)\s*h/);
            const mMatch = curr.match(/(\d+)\s*m/);

            if (hMatch) hours = parseInt(hMatch[1]);
            if (mMatch) minutes = parseInt(mMatch[1]);

            return acc + hours * 60 + minutes;
        }, 0);

        const formattedDuration = `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`;

        // Combine all data into a single response object with lessons inside course
        const responseData = {
            ...course.toObject(),
            lessons: lessons,
            totalPrice: lessonData.totalPrice,
            authors: lessonData.authorNames,
            totalDuration: formattedDuration
        };

        return res.json({
            success: true,
            data: responseData,
            message: "Course details with lessons"
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

