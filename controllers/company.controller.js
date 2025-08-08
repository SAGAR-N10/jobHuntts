import { Company } from "../models/company.model.js";
export const registerCompany = async (req, res) => {
    try {
        const { companyName } = req.body;
        if (!companyName) {
            return res.status(400).json({
                message: "Company name is required",
                success: false
            });
        }
        let company = await Company.findOne({ name: companyName });
        if (company) {
            return res.status(400).json({
                message: "You can't register same company",
                success: false
            })
        };
        company = await Company.create({
            name: companyName,
            userId: req.id // Assuming req.id is the authenticated user's ID
        });

        return res.status(201).json({
            message: "Company registered successfully",
            success: true,
            company
        });

    } catch (error) {
        console.log(error);

    }
}
export const getCompany = async (req, res) => {
    try {
        const userId = req.id; // logged-in user's ID
        const companies = await Company.find({ userId });
        if (!companies) {
            return res.status(404).json({
                message: "companies not found",
                success: false
            })
        }
        return res.status(200).json({
            success: true,
            companies
        }); 

    } catch (error) {
        console.log(error);

    }
}
//get company by id
export const getCompanyById = async (req, res) => {
    try {
        const companyId = req.params.id; // Assuming the company ID is passed as a URL parameter
        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({
                message: "Company not found",
                success: false
            });
        }
        return res.status(200).json({
            success: true,
            company
        });
    } catch (error) {
        console.log(error);

    }
}
export const updateCompany = async (req, res) => {
    try {
        const { name, description, website, location } = req.body;
        const file = req.file;

        // Prepare data to update
        const updateData = { name, description, website, location };

        // TODO: If using cloudinary for logo/image, handle file upload here

        const company = await Company.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

        if (!company) {
            return res.status(404).json({
                message: "Company not found",
                success: false
            });
        }

        return res.status(200).json({
            message: "Company information updated.",
            company,
            success: true   
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Something went wrong",
            success: false
        });
    }
};
