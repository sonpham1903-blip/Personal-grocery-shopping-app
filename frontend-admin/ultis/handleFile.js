const ensureCloudinaryConfig = () => {
	const requiredKeys = [
		"VITE_CLOUDINARY_CLOUD_NAME",
		"VITE_CLOUDINARY_UPLOAD_PRESET",
	];

	const missing = requiredKeys.filter((key) => !import.meta.env[key]);
	if (missing.length > 0) {
		throw new Error(`Thiếu cấu hình Cloudinary: ${missing.join(", ")}`);
	}
};

const sanitizeFileName = (name = "") => name.replace(/\s+/g, "-");

const buildUploadName = (folder, file) => {
	const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}-${sanitizeFileName(file.name)}`;
	return folder ? `${folder}/${uniqueName}` : uniqueName;
};

const getResourceType = (file) => {
	if (file?.type === "application/pdf") {
		return "raw";
	}

	if (file?.type?.startsWith("image/")) {
		return "image";
	}

	return "auto";
};

const uploadToCloudinary = async (file, folder) => {
	if (!file) {
		return "";
	}

	ensureCloudinaryConfig();

	const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
	const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
	const resourceType = getResourceType(file);
	const formData = new FormData();
	formData.append("file", file);
	formData.append("upload_preset", uploadPreset);
	formData.append("public_id", buildUploadName(folder, file));
	formData.append("resource_type", resourceType);

	const response = await fetch(
		`https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
		{
			method: "POST",
			body: formData,
		},
	);

	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(errorText || "Upload Cloudinary thất bại");
	}

	const data = await response.json();
	return data.secure_url || data.url || "";
};

export const uploadSingleFile = async (file, folder) => uploadToCloudinary(file, folder);

export const uploadMultipleFiles = async (files, folder) => {
	if (!files || files.length === 0) {
		return [];
	}

	return Promise.all(Array.from(files).map((file) => uploadToCloudinary(file, folder)));
};
