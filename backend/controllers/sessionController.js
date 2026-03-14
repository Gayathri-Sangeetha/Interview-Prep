const Session = require("../models/Session");
const Question = require("../models/Question");
const Groq = require("groq-sdk");

if (!process.env.GROQ_API_KEY) {
  throw new Error("GROQ_API_KEY is not defined in environment variables");
}

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const createSession = async (req, res, next) => {
  try {
    const { role, experience, description } = req.body;

    if (!role || !experience) {
      return res.status(400).json({ message: "Role and experience are required" });
    }

    const prompt = `Generate 10 technical interview questions with detailed answers for a ${role} with ${experience} years of experience.
${description ? `Additional context: ${description}` : ""}
Return ONLY a valid JSON array in this exact format, no markdown, no extra text:
[{"question": "...", "answer": "..."}]`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    let text = completion.choices[0]?.message?.content?.trim() || "";

    // Remove possible code block formatting
    text = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

    let qaPairs;

    try {
      qaPairs = JSON.parse(text);
    } catch {
      return res.status(500).json({ message: "Failed to parse AI response" });
    }

    const session = await Session.create({
      user: req.user._id,
      role,
      experience,
      description,
    });

    const questionDocs = await Question.insertMany(
      qaPairs.map((qa) => ({
        session: session._id,
        user: req.user._id,
        question: qa.question,
        answer: qa.answer,
      }))
    );

    session.questions = questionDocs.map((q) => q._id);
    await session.save();

    res.status(201).json({ session, questions: questionDocs });
  } catch (err) {
    next(err);
  }
};

const getSessions = async (req, res, next) => {
  try {
    const sessions = await Session.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    res.json(sessions);
  } catch (err) {
    next(err);
  }
};

const getSessionById = async (req, res, next) => {
  try {
    const session = await Session.findOne({
      _id: req.params.id,
      user: req.user._id,
    }).populate("questions");

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    res.json(session);
  } catch (err) {
    next(err);
  }
};

const deleteSession = async (req, res, next) => {
  try {
    const session = await Session.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    await Question.deleteMany({ session: session._id });
    await session.deleteOne();

    res.json({ message: "Session deleted successfully" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createSession,
  getSessions,
  getSessionById,
  deleteSession,
};