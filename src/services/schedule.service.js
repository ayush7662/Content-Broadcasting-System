const { Content, ContentSlot, ContentSchedule, sequelize } = require("../models");
const { Op } = require("sequelize");


exports.getLive = async (teacherId, subject = null) => {
  const now = new Date();

  // Build where clause
  const whereClause = {
    uploaded_by: teacherId,
    status: "approved",
    start_time: { [Op.lte]: now },
    end_time: { [Op.gte]: now },
  };

  if (subject) {
    whereClause.subject = subject;
  }

  // Get approved, active content
  const contents = await Content.findAll({
    where: whereClause,
    order: [["created_at", "ASC"]],
    include: [
      {
        model: ContentSchedule,
        as: "schedules",
        required: false,
        include: [
          {
            model: ContentSlot,
            as: "slot",
            required: false,
          },
        ],
      },
    ],
  });

  if (!contents || contents.length === 0) {
    return [];
  }

  // Group by subject for independent rotation
  const subjectGroups = {};
  for (const content of contents) {
    const subj = content.subject;
    if (!subjectGroups[subj]) {
      subjectGroups[subj] = [];
    }
    subjectGroups[subj].push(content);
  }

  const result = [];

  
  for (const [subj, items] of Object.entries(subjectGroups)) {
    // Calculate rotation window
    // Default rotation: 5 minutes per content
    const rotationDuration = items[0]?.schedules?.[0]?.duration || 5;
    const totalCycle = items.length * rotationDuration * 60 * 1000; // in ms

    // Get current position in cycle
    const cyclePosition = Date.now() % totalCycle;
    const activeIndex = Math.floor(cyclePosition / (rotationDuration * 60 * 1000)) % items.length;

    const activeContent = items[activeIndex];

    result.push({
      subject: subj,
      content: {
        id: activeContent.id,
        title: activeContent.title,
        description: activeContent.description,
        file_path: activeContent.file_path,
        file_type: activeContent.file_type,
        file_size: activeContent.file_size,
        start_time: activeContent.start_time,
        end_time: activeContent.end_time,
        uploaded_by: activeContent.uploaded_by,
        approved_by: activeContent.approved_by,
        approved_at: activeContent.approved_at,
        created_at: activeContent.created_at,
      },
      rotation: {
        current_index: activeIndex,
        total_items: items.length,
        rotation_duration_minutes: rotationDuration,
        all_items_in_subject: items.map((item, idx) => ({
          id: item.id,
          title: item.title,
          is_current: idx === activeIndex,
        })),
      },
    });
  }

  return result;
};


exports.getTeacherContent = async (teacherId, filters = {}) => {
  const where = { uploaded_by: teacherId };

  if (filters.status) {
    where.status = filters.status;
  }
  if (filters.subject) {
    where.subject = filters.subject;
  }

  return await Content.findAll({
    where,
    order: [["created_at", "DESC"]],
    include: [
      {
        model: ContentSchedule,
        as: "schedules",
        required: false,
      },
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
};


exports.getAllContent = async (filters = {}, pagination = {}) => {
  const where = {};
  const { page = 1, limit = 20 } = pagination;
  const offset = (page - 1) * limit;

  if (filters.status) {
    where.status = filters.status;
  }
  if (filters.subject) {
    where.subject = filters.subject;
  }
  if (filters.teacher_id) {
    where.uploaded_by = filters.teacher_id;
  }

  const { count, rows } = await Content.findAndCountAll({
    where,
    order: [["created_at", "DESC"]],
    limit: parseInt(limit),
    offset: parseInt(offset),
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

  return {
    data: rows,
    pagination: {
      total: count,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(count / limit),
    },
  };
};
