import * as enquiriesService from '../services/enquiries.service.js';

export async function createEnquiry(req, res, next) {
  try {
    res.status(201).json(await enquiriesService.createEnquiry(req.body));
  } catch (error) {
    next(error);
  }
}

export async function listEnquiries(req, res, next) {
  try {
    res.json(await enquiriesService.listEnquiries(req.query));
  } catch (error) {
    next(error);
  }
}

export async function updateEnquiryStatus(req, res, next) {
  try {
    const enquiry = await enquiriesService.updateEnquiryStatus(req.params.id, req.body);
    if (!enquiry) return res.status(404).json({ message: 'Enquiry not found.' });
    res.json(enquiry);
  } catch (error) {
    next(error);
  }
}

export async function deleteEnquiry(req, res, next) {
  try {
    const enquiry = await enquiriesService.deleteEnquiry(req.params.id);
    if (!enquiry) return res.status(404).json({ message: 'Enquiry not found.' });
    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
}
