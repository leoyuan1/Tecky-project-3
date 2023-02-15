import express from 'express'
import formidable from 'formidable'
export const uploadDir = 'uploads'

export const userForm = formidable({
	uploadDir,
	keepExtensions: true,
	maxFiles: 1,
	maxFileSize: 50 * 1024 * 1024 ** 2, // the default limit is 50MB
	filter: (part) => part.mimetype?.startsWith("image/") || false,
	filename: (originalName, originalExt, part, form) => {
		let fieldName = part.name?.substring(0, part.name.length - 1);
		let timestamp = Date.now();
		let ext = part.mimetype?.split("/").pop();
		return `${fieldName}-${timestamp}.${ext}`;
	}
});
export function userFormidablePromise(req: express.Request) {
	return new Promise<any>((resolve, reject) => {
		userForm.parse(req, (err, fields, files) => {
			if (err) {
				reject(err);
				return;
			}
			resolve({ fields, files });
		});
	});
}