const Courses= require('../../models/admin/courses')


// Create a new category
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

// Get single category by ID
exports.getCoursesById = async (req, res) => {
    try {
        const courses = await Courses.findById(req.params.id);
        if (!courses) return res.status(404).json({ success: false, message: 'Courses not found' });
        return res.json({ success: true, data: courses, message: "One courses" });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

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
        return res.json({ success: true, data: Courses, message: "Updated" });
    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: "Server Error" });
    }
};

// Delete a category
exports.deleteCourse = async (req, res) => {
    try {
        const result = await Courses.findByIdAndDelete(req.params.id);
        if (!result) return res.status(404).json({ success: false, message: 'Courses not found' });
        return res.json({ success: true, message: 'Courses deleted' });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};