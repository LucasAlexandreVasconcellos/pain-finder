"""Pydantic v2 Schema models and validation for Dark Quiz scripts (@bussinessmasterbr).

Enforces strict structural rules, retention pacing, and viral TikTok constraints:
- 5 retention blocks: Hook, Easy (Q1-Q2), Medium (Q3-Q4) + Micro-curiosity,
  Trap (Q5) + Difficult (Q6), Final Boss (Q7) + Score CTA + Bonus (Q8).
- Duration strictly within [65.0s, 80.0s] (asserted >= 62.0s programmatically).
- Q5 must be pegadinha (is_trap=True).
- Q8 must NEVER be revealed in video (reveal_in_video=False).
"""

import json
from pathlib import Path
from typing import Any, Dict, List, Literal, Optional, Union

try:
    from pydantic import BaseModel, Field, model_validator
    _PYDANTIC_V2 = True
except ImportError:
    from pydantic import BaseModel, Field, root_validator  # type: ignore
    _PYDANTIC_V2 = False


class VoiceConfig(BaseModel):
    """Configuration for neural pt-BR text-to-speech."""
    voice_name: str = "pt-BR-AntonioNeural"
    rate: str = "+5%"
    pitch: str = "+0Hz"


class HookBlock(BaseModel):
    """Anti-scroll hook (00s-04s) challenging ego and promising trap in Q5."""
    hook_text: str = Field(..., max_length=150, description="Hook narration text")
    subtitles_highlight: str = Field(..., description="Key headline/badge on screen")
    duration_seconds: float = Field(default=4.0, ge=3.5, le=4.5)
    sfx: str = Field(default="sfx_whoosh_impact", description="Identifier for hook sound cue")


class QuizOption(BaseModel):
    """Single answer option (A, B, C, or D)."""
    id: Literal["A", "B", "C", "D"]
    text: str = Field(..., max_length=50)


class QuestionAudioCues(BaseModel):
    """Audio cues triggered during a question lifecycle."""
    intro: Optional[str] = None
    countdown: str = "sfx_tick_tack_3s"
    reveal: str = "sfx_correct_ding"


class QuestionItem(BaseModel):
    """Single question item in the 7-question progression."""
    index: int = Field(..., ge=1, le=7)
    level: Literal["facil", "medio", "dificil", "impossivel"]
    level_badge: str
    question_text: str = Field(..., max_length=120)
    options: List[QuizOption] = Field(..., min_length=4, max_length=4)
    correct_option: Literal["A", "B", "C", "D"]
    correct_index: int = Field(..., ge=0, le=3)
    explanation: str = Field(..., max_length=150)
    is_trap: bool = False
    countdown_seconds: float = Field(default=3.0, ge=2.5, le=4.0)
    audio_cues: QuestionAudioCues = Field(default_factory=QuestionAudioCues)


class MicroCuriosityBlock(BaseModel):
    """Pattern-interrupt micro-curiosity block (~4s) inserted at ~30s mark."""
    insert_after_question: Literal[3, 4] = 3
    title: str = "💡 CURIOSIDADE RELÂMPAGO"
    text: str = Field(..., max_length=160)
    duration_seconds: float = Field(default=4.0, ge=3.5, le=4.5)
    sfx: str = Field(default="sfx_curiosity_bell")


class ScoreCTABlock(BaseModel):
    """Call to action prompting viewers to comment their quiz score."""
    text: str = Field(default="Quantas você acertou? Comente seu placar!", max_length=100)
    duration_seconds: float = Field(default=3.0, ge=2.5, le=3.5)


class BonusQuestionBlock(BaseModel):
    """Unanswered 8th bonus question acting as comment loop cliffhanger."""
    index: int = 8
    badge_label: str = "🔥 PERGUNTA BÔNUS"
    question_text: str = Field(..., max_length=140)
    options: Optional[List[str]] = None
    correct_answer_secret: str = Field(..., min_length=1)
    reveal_in_video: bool = False  # Mandatory False: drives rewatches and comments
    duration_seconds: float = Field(default=6.0, ge=5.0, le=7.0)
    pinned_comment: str = Field(..., min_length=5)


class SEOMetadata(BaseModel):
    """SEO title, caption, hashtags, and cover copy for TikTok publication."""
    title: str = Field(..., max_length=100)
    caption: str = Field(..., max_length=350)
    hashtags: List[str] = Field(..., min_length=5)
    cover_headline: str = Field(..., max_length=50)


class DarkQuizScript(BaseModel):
    """Complete root model for a TikTok Dark Quiz script (>60s, 65s-80s)."""
    script_id: str
    slot: Literal["12:30", "16:00", "18:30"]
    theme: str
    target_duration_seconds: float = Field(..., ge=65.0, le=80.0)
    voice_config: VoiceConfig = Field(default_factory=VoiceConfig)
    hook: HookBlock
    questions: List[QuestionItem] = Field(..., min_length=7, max_length=7)
    micro_curiosity: MicroCuriosityBlock
    score_cta: ScoreCTABlock = Field(default_factory=ScoreCTABlock)
    bonus_question: BonusQuestionBlock
    seo: SEOMetadata

    def estimate_total_duration(self) -> float:
        """Calculates theoretical duration in seconds based on reading rate + timers + sfx."""
        dur = self.hook.duration_seconds
        for q in self.questions:
            read_time = 2.5 if q.index not in (5, 7) else 3.0
            sfx_time = 1.0 if q.is_trap else 0.0
            reveal_time = 2.0 if q.index in (5, 7) else 1.5
            dur += sfx_time + read_time + q.countdown_seconds + reveal_time
        dur += self.micro_curiosity.duration_seconds
        dur += 2.0  # Transition buffer to Final Boss
        dur += self.score_cta.duration_seconds
        dur += self.bonus_question.duration_seconds
        dur += 1.0  # Outro / seamless video loop
        return round(dur, 2)

    def to_dict(self) -> Dict[str, Any]:
        """Serializes script to a plain Python dict."""
        if _PYDANTIC_V2:
            return self.model_dump()
        return self.dict()  # type: ignore

    def to_json(self, indent: int = 2) -> str:
        """Serializes script to formatted JSON string."""
        if _PYDANTIC_V2:
            return self.model_dump_json(indent=indent)
        return json.dumps(self.dict(), ensure_ascii=False, indent=indent)

    def save_to_file(self, file_path: Union[str, Path], indent: int = 2) -> Path:
        """Saves script to a JSON file on disk."""
        target = Path(file_path)
        target.parent.mkdir(parents=True, exist_ok=True)
        with open(target, "w", encoding="utf-8") as f:
            if _PYDANTIC_V2:
                f.write(self.model_dump_json(indent=indent))
            else:
                json.dump(self.dict(), f, ensure_ascii=False, indent=indent)
        return target

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> "DarkQuizScript":
        """Deserializes from dictionary."""
        if _PYDANTIC_V2:
            return cls.model_validate(data)
        obj = cls.parse_obj(data)
        obj._run_validations()
        return obj

    @classmethod
    def from_file(cls, file_path: Union[str, Path]) -> "DarkQuizScript":
        """Loads and validates a script from JSON file."""
        target = Path(file_path)
        if not target.exists():
            raise FileNotFoundError(f"Script file not found: {target}")
        with open(target, "r", encoding="utf-8") as f:
            data = json.load(f)
        return cls.from_dict(data)

    if _PYDANTIC_V2:
        @model_validator(mode="after")
        def validate_retention_rules(self) -> "DarkQuizScript":
            self._run_validations()
            return self
    else:
        @root_validator(skip_on_failure=True)
        def validate_retention_rules_v1(cls, values: Dict[str, Any]) -> Dict[str, Any]:
            # Basic checks in root validator for Pydantic v1
            questions = values.get("questions", [])
            if len(questions) == 7 and not getattr(questions[4], "is_trap", False):
                raise ValueError("Pergunta 5 deve ser a pegadinha (is_trap=True).")
            bonus = values.get("bonus_question")
            if bonus and getattr(bonus, "reveal_in_video", False):
                raise ValueError("Pergunta Bônus (Q8) não deve ser revelada no vídeo.")
            return values

    def _run_validations(self) -> None:
        """Validates core psychological retention rules and duration constraints."""
        # 1. Question count and indexing
        if len(self.questions) != 7:
            raise ValueError(f"Script must contain exactly 7 main questions, got {len(self.questions)}")
        for i, q in enumerate(self.questions, start=1):
            if q.index != i:
                raise ValueError(f"Question at position {i} must have index={i}, got {q.index}")
            # Verify options consistency
            if len(q.options) != 4:
                raise ValueError(f"Question {q.index} must have exactly 4 options, got {len(q.options)}")
            opt_ids = [opt.id for opt in q.options]
            if opt_ids != ["A", "B", "C", "D"]:
                raise ValueError(f"Question {q.index} options must be ['A', 'B', 'C', 'D'], got {opt_ids}")
            if q.options[q.correct_index].id != q.correct_option:
                raise ValueError(
                    f"Question {q.index}: correct_option '{q.correct_option}' does not match "
                    f"options[{q.correct_index}].id '{q.options[q.correct_index].id}'"
                )

        # 2. Q5 Trap validation
        q5 = self.questions[4]
        if not q5.is_trap:
            raise ValueError("Pergunta 5 (índice 5, posição 4) deve ser obrigatoriamente a pegadinha (is_trap=True).")

        # 3. Hook anticipation of Q5
        hook_lower = self.hook.hook_text.lower()
        if ("5" not in hook_lower) and ("quinta" not in hook_lower) and ("número 5" not in hook_lower):
            raise ValueError("O gancho (hook) deve antecipar explicitamente a pegadinha da pergunta 5 para reter o público.")

        # 4. Q8 Bonus Question validation (Never revealed in video)
        if self.bonus_question.reveal_in_video:
            raise ValueError("Pergunta Bônus (Q8) JAMAIS deve ser revelada no vídeo (reveal_in_video=False).")
        if self.bonus_question.index != 8:
            raise ValueError(f"Pergunta Bônus deve ter index=8, got {self.bonus_question.index}")
        if not self.bonus_question.correct_answer_secret.strip():
            raise ValueError("Pergunta Bônus deve possuir a resposta correta secreta preenchida.")
        if not self.bonus_question.pinned_comment.strip():
            raise ValueError("Pergunta Bônus deve ter o texto do comentário fixado (pinned_comment) preenchido.")

        # 5. Micro-curiosity placement
        if self.micro_curiosity.insert_after_question not in (3, 4):
            raise ValueError(
                f"Micro-curiosity must be inserted after Q3 or Q4, got {self.micro_curiosity.insert_after_question}"
            )

        # 6. Duration Guardrail [65.0s, 80.0s]
        total_dur = self.estimate_total_duration()
        if not (65.0 <= total_dur <= 80.0):
            raise ValueError(
                f"Duração estimada ({total_dur:.1f}s) está fora da janela mandatória de [65.0s, 80.0s]. "
                "Vídeos para TikTok Creator Rewards devem ter obrigatoriamente >60s."
            )
