const Question = require("../models/Question");
const Groq = require("groq-sdk");

if (!process.env.GROQ_API_KEY) {
  throw new Error("GROQ_API_KEY is not defined in environment variables");
}

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const togglePin = async (req, res, next) => {
  try {
    const question = await Question.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    question.isPinned = !question.isPinned;
    await question.save();

    res.json(question);
  } catch (err) {
    next(err);
  }
};

const getPinnedQuestions = async (req, res, next) => {
  try {
    const pinned = await Question.find({
      user: req.user._id,
      isPinned: true,
    }).populate("session", "role experience");

    res.json(pinned);
  } catch (err) {
    next(err);
  }
};

const getAIExplanation = async (req, res, next) => {
  try {
    const { concept } = req.body;

    if (!concept) {
      return res.status(400).json({ message: "Concept is required" });
    }

    const prompt = `Explain the following concept clearly and concisely for a developer in interview context: "${concept}". Keep it under 200 words.`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant", // you can also use other Groq models
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    res.json({
      explanation: completion.choices[0]?.message?.content,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  togglePin,
  getPinnedQuestions,
  getAIExplanation,
};