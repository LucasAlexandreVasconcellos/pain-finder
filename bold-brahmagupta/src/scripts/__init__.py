"""Script generation and schema package for TikTok Dark Quiz (@bussinessmasterbr)."""

from src.scripts.schema import (
    DarkQuizScript,
    HookBlock,
    QuestionItem,
    QuizOption,
    QuestionAudioCues,
    MicroCuriosityBlock,
    ScoreCTABlock,
    BonusQuestionBlock,
    SEOMetadata,
    VoiceConfig,
)
from src.scripts.generator import (
    DarkQuizGenerator,
    generate_daily_scripts,
    generate_script,
    generate_quiz_script,
    get_preset_script,
    list_available_slots,
)
from src.scripts.guide_builder import (
    build_markdown_guide,
    build_retention_guide,
)

__all__ = [
    "DarkQuizScript",
    "HookBlock",
    "QuestionItem",
    "QuizOption",
    "QuestionAudioCues",
    "MicroCuriosityBlock",
    "ScoreCTABlock",
    "BonusQuestionBlock",
    "SEOMetadata",
    "VoiceConfig",
    "DarkQuizGenerator",
    "generate_daily_scripts",
    "generate_script",
    "generate_quiz_script",
    "get_preset_script",
    "list_available_slots",
    "build_markdown_guide",
    "build_retention_guide",
]
