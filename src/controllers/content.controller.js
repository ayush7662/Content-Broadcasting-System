const { Content } = require("../models");
const scheduleService = require("../services/schedule.service");

const getFileUrl = (filePath) => {
  if (!filePath) return null;
  const parts = filePath.replace(/\\/g, "/").split("/");
  const filename = parts[parts.length - 1];
  return `/uploads/${filename}`;
};

// ================= UPLOAD =================
exports.upload = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: "File is required" });
    }

    const { title, description, subject, start_time, end_time } = req.body;

    const data = await Content.create({
      title,
      description,
      subject,
      file_path: req.file.path,
      file_type: req.file.mimetype,
      file_size: req.file.size,
      start_time: start_time || null,
      end_time: end_time || null,
      uploaded_by: req.user.id,
      status: "pending",
    });

    const result = data.toJSON();
    result.file_url = getFileUrl(result.file_path);

    return res.status(201).json({
      msg: "Content uploaded successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// ================= APPROVE =================
exports.approve = async (req, res, next) => {
  try {
    const content = await Content.findByPk(req.params.id);

    if (!content) {
      return res.status(404).json({ msg: "Content not found" });
    }

    if (content.status === "approved") {
      return res.status(400).json({ msg: "Content is already approved" });
    }

    content.status = "approved";
    content.approved_by = req.user.id;
    content.approved_at = new Date();

    await content.save();

    const result = content.toJSON();
    result.file_url = getFileUrl(result.file_path);

    return res.json({
      msg: "Content approved successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// ================= REJECT =================
exports.reject = async (req, res, next) => {
  try {
    const { reason } = req.body;
    if (!reason) {
      return res.status(400).json({ msg: "Rejection reason is required" });
    }

    const content = await Content.findByPk(req.params.id);

    if (!content) {
      return res.status(404).json({ msg: "Content not found" });
    }

    if (content.status === "rejected") {
      return res.status(400).json({ msg: "Content is already rejected" });
    }

    content.status = "rejected";
    content.rejection_reason = reason;
    content.approved_by = req.user.id;

    await content.save();

    const result = content.toJSON();
    result.file_url = getFileUrl(result.file_path);

    return res.json({
      msg: "Content rejected successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// ================= LIVE (Public Broadcasting) =================
exports.live = async (req, res, next) => {
  try {
    const { teacherId } = req.params;
    const { subject } = req.query;

    const data = await scheduleService.getLive(teacherId, subject || null);

    if (!data || data.length === 0) {
      return res.status(200).json({
        msg: "No content available",
        data: [],
      });
    }

    // Add file_url to each content item
    const enrichedData = data.map((item) => ({
      ...item,
      content: {
        ...item.content,
        file_url: getFileUrl(item.content.file_path),
      },
    }));

    return res.json({
      msg: "Live content fetched successfully",
      data: enrichedData,
    });
  } catch (err) {
    next(err);
  }
};

// ================= GET MY UPLOADS (Teacher) =================
exports.myUploads = async (req, res, next) => {
  try {
    const { status, subject } = req.query;
    const filters = { status, subject };

    const data = await scheduleService.getTeacherContent(req.user.id, filters);

    const enrichedData = data.map((item) => {
      const json = item.toJSON();
      json.file_url = getFileUrl(json.file_path);

      if (json.uploader) {
        json.uploaded_by_name = json.uploader.name;
        json.uploaded_by_email = json.uploader.email;
      }
      if (json.approver) {
        json.approved_by_name = json.approver.name;
        json.approved_by_email = json.approver.email;
      }

      return json;
    });

    return res.json({
      msg: "Your uploads fetched successfully",
      data: enrichedData,
    });
  } catch (err) {
    next(err);
  }
};

// ================= GET ALL CONTENT (Principal) =================
exports.getAll = async (req, res, next) => {
  try {
    const { status, subject, teacher_id, page, limit } = req.query;

    const result = await scheduleService.getAllContent(
      { status, subject, teacher_id },
      { page, limit }
    );

    const enrichedData = result.data.map((item) => {
      const json = item.toJSON();
      json.file_url = getFileUrl(json.file_path);

      if (json.uploader) {
        json.uploaded_by_name = json.uploader.name;
        json.uploaded_by_email = json.uploader.email;
      }
      if (json.approver) {
        json.approved_by_name = json.approver.name;
        json.approved_by_email = json.approver.email;
      }

      return json;
    });

    return res.json({
      msg: "All content fetched successfully",
      data: enrichedData,
      pagination: result.pagination,
    });
  } catch (err) {
    next(err);
  }
};

// ================= GET PENDING CONTENT (Principal) =================
exports.getPending = async (req, res, next) => {
  try {
    const result = await scheduleService.getAllContent(
      { status: "pending" },
      req.query
    );

    const enrichedData = result.data.map((item) => {
      const json = item.toJSON();
      json.file_url = getFileUrl(json.file_path);

      if (json.uploader) {
        json.uploaded_by_name = json.uploader.name;
        json.uploaded_by_email = json.uploader.email;
      }
      if (json.approver) {
        json.approved_by_name = json.approver.name;
        json.approved_by_email = json.approver.email;
      }

      return json;
    });

    return res.json({
      msg: "Pending content fetched successfully",
      data: enrichedData,
      pagination: result.pagination,
    });
  } catch (err) {
    next(err);
  }
};

// ================= GET CONTENT BY ID =================
exports.getById = async (req, res, next) => {
  try {
    const content = await Content.findByPk(req.params.id, {
      include: [
        {
          model: require("../models").User,
          as: "uploader",
          attributes: ["id", "name", "email"],
        },
        {
          model: require("../models").User,
          as: "approver",
          attributes: ["id", "name", "email"],
        },
      ],
    });

    if (!content) {
      return res.status(404).json({ msg: "Content not found" });
    }

    const result = content.toJSON();
    result.file_url = getFileUrl(result.file_path);

    if (result.uploader) {
      result.uploaded_by_name = result.uploader.name;
      result.uploaded_by_email = result.uploader.email;
    }
    if (result.approver) {
      result.approved_by_name = result.approver.name;
      result.approved_by_email = result.approver.email;
    }

    return res.json({
      msg: "Content fetched successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// ================= DELETE CONTENT =================
exports.delete = async (req, res, next) => {
  try {
    const content = await Content.findByPk(req.params.id);

    if (!content) {
      return res.status(404).json({ msg: "Content not found" });
    }

    if (content.uploaded_by !== req.user.id && req.user.role !== "principal") {
      return res.status(403).json({ msg: "Forbidden" });
    }

    await content.destroy();

    return res.json({
      msg: "Content deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};
