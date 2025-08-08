import {Job} from '../models/job.model.js';
//admin post karega job
export const postJob = async (req, res) => {
    try {
        const { title, description, requirements, salary, location, jobType, experiance, position, companyId } = req.body;
        const userId = req.id; // logged-in user's ID
        if (!title || !description || !requirements || !salary || !location || !jobType || !experiance || !position || !companyId) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        }
        const job = await Job.create({
            title,
            description,
            requirements:requirements.split(","),
            salary:Number(salary),
            location,
            jobType,
            experianceLevel:experiance,
            position,
            company:companyId,
            created_by:userId


        })
        return res.status(201).json({
            message: "New Job created successfully",
            success: true,
            job
        }); 


    } catch (error) {
        console.log(error);
    }
}
//students
export const getAllJobs = async (req, res) => {
    try {
        const keyword = req.query.keyword || "";
        const query = {
            $or:[
            {title : { $regex: keyword, $options: "i" }}, 
            {description : { $regex: keyword, $options: "i" }}, 
        ]
        };
        const jobs = await Job.find(query).populate({
            path: 'company'
        }).sort({ createdAt: -1 });

        
        if(!jobs){
            return res.status(404).json({
                message: "Job not found",
                success: false
            })
        };
        return res.status(200).json({
            success: true,
            jobs
        });
    } catch (error) {
        console.log(error);
        
    }
}
//students
export const getJobById = async (req, res) => {
    try {
        const jobId = req.params.id; // Assuming the job ID is passed as a URL parameter
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                message: "Job not found",
                success: false
            });
        }
        return res.status(200).json({
            success: true,
            job
        }); 
        
    } catch (error) {
        console.log(error);
        
    }

}
//admin kitne job create kara abhi tak
export const getAdminJobs = async(req,res) => {
    try {
        const adminId = req.id; // Assuming the admin's ID is stored in req.id
        const jobs = await Job.find({ created_by: adminId });
        if(!jobs){
            return res.status(404).json({
                message: " Jobs Not Found ",
                success: false
            });
         }
         return res.status(200).json({
            success: true,
            jobs
         });
    } catch (error) {
        console.log(error);
        
    }
}