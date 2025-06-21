const Lesson = require("../../models/admin/lessonContent")


exports.createLesson = async (req, res) => {
    const { name, price, courseId, userId } = req.body
    // validataion
    if (!name || !price || !courseId || !userId) {
        return res.status(403).json(
            { success: false, message: "Missing field" }
        )
    }
    try {
        const lesson= new Lesson(
            {
                name,
                price,
                courseId,
                sellerId: userId
            }
        )
        await lesson.save()
        return res.status(200).json(
            {
                success: true,
                data: lesson,
                message: 'New Lesson Created'
            }
        )
    } catch (err) {
        return res.status(500).json(
            {
                success: false,
                message: 'Server error'
            }
        )
    }
}

exports.getLesson = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = "" } =
            req.query

        let filter = {}
        if (search) {
            filter.$or = [
                {
                    name:
                    {
                        $regex: search,
                        $options: 'i'
                    }
                }
            ]
        }
        const skips = (page - 1) * limit

        const lessons = await Lesson.find(filter)
            .populate("courseId", "name")
            .populate("sellerId", "firstName email")
            .skip(skips)
            .limit(Number(limit))
        const total = await Lesson.countDocuments(filter)
        return res.status(200).json(
            {
                success: true,
                message: "Requested Lesson Fetched",
                data: lessons,
                pagination: {
                    total,
                    page: Number(page),
                    limit: Number(limit),
                    totalPages: Math.ceil(
                        total / limit
                    )
                }
            }
        )
    } catch (err) {
        console.log('getLessons', {
            message: err.message,
            stack: err.stack,
        });
        return res.status(500).json(
            { success: false, message: "Server error" }
        )
    }
}