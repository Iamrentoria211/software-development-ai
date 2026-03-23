import os
import json
import re
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_community.tools import DuckDuckGoSearchRun
from datetime import datetime

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    google_api_key=os.getenv("GOOGLE_API_KEY")
)

search = DuckDuckGoSearchRun()

class ResearchRequest(BaseModel):
    topic: str

class ResearchResponse(BaseModel):
    topic: str
    report: str
    timestamp: str

@app.get("/")
def root():
    return {"status": "Research Agent API is running"}

@app.post("/research", response_model=ResearchResponse)
def run_research(request: ResearchRequest):
    topic = request.topic

    result1 = search.run(f"{topic} overview and definition")
    result2 = search.run(f"{topic} latest developments 2025")
    result3 = search.run(f"{topic} future outlook and trends")

    prompt = f"""You are an expert research analyst. Write a comprehensive professional research report about: {topic}

Use the following search data:
SOURCE 1: {result1}
SOURCE 2: {result2}
SOURCE 3: {result3}

Format your report with these exact sections using markdown:
## Executive Summary
(2-3 sentence overview)

## Background
(Context and history)

## Key Findings
(Detailed bullet points)

## Analysis
(Your analytical insights)

## Conclusion
(Summary and final thoughts)

Write in a professional, clear, and detailed tone."""

    report = llm.invoke(prompt).content

    return ResearchResponse(
        topic=topic,
        report=report,
        timestamp=datetime.now().strftime("%B %d, %Y at %H:%M")
    )
# =====================================

# =====================================

class BlueprintRequest(BaseModel):
    project_name: str
    project_description: str
    section: str

class BlueprintResponse(BaseModel):
    section: str
    content: str

SECTION_PROMPTS = {
    "Tech stack": """Recommend the best technology stack for this project. Include:
- Frontend framework and why
- Backend framework and why
- Database and why
- Hosting/deployment options (free and paid tiers)
- Additional tools and libraries
Format with clear sections and bullet points.""",

    "Folder structure": """Generate a complete, production-ready folder structure for this project.
Show the full directory tree with brief comments explaining what each folder/file is for.
Use a code block with the tree structure.""",

    "SDLC": """Create a detailed Software Development Life Cycle plan for this project. Include:
- Phase 1: Planning & Requirements
- Phase 2: System Design
- Phase 3: Implementation
- Phase 4: Testing
- Phase 5: Deployment
- Phase 6: Maintenance
For each phase include goals, deliverables, and estimated duration.""",

    "Security practices": """Provide comprehensive security practices for this project. Include:
- Authentication & authorization strategy
- Data encryption (at rest and in transit)
- Input validation and sanitization
- API security (rate limiting, CORS, headers)
- Common vulnerability prevention (SQL injection, XSS, CSRF)
- Security testing recommendations
- Secrets management""",

    "Best practices": """List the most important programming and development best practices for this project. Include:
- Code organization and architecture patterns (SOLID, DRY, KISS)
- Naming conventions
- Error handling strategy
- Logging and monitoring
- Code review guidelines
- Documentation standards
- Git workflow and branching strategy""",

    "CI/CD guide": """Create a complete CI/CD pipeline guide for this project. Include:
- Recommended CI/CD platform (GitHub Actions, GitLab CI, etc.)
- Pipeline stages (build, test, deploy)
- Environment strategy (dev, staging, production)
- Automated testing integration
- Deployment strategy (blue-green, rolling, canary)
- Rollback procedures
- Example pipeline configuration""",

    "Roadmap": """Create a detailed development roadmap for this project. Include:
- MVP features (Month 1-2)
- Phase 2 features (Month 3-4)
- Phase 3 features (Month 5-6)
- Future enhancements
- Key milestones and success metrics
Format as a clear timeline with deliverables per phase.""",

    "Database schema": """Design a complete database schema for this project. Include:
- All main tables/collections with fields and data types
- Primary keys, foreign keys, and indexes
- Relationships between tables (ERD description)
- Example SQL CREATE statements or schema definition
- Indexing strategy for performance""",

    "API design": """Design a complete RESTful API for this project. Include:
- Base URL structure and versioning
- Authentication endpoints
- All main resource endpoints (CRUD operations)
- Request/response format examples
- Error response format
- Rate limiting strategy
- API documentation approach (Swagger/OpenAPI)""",

    "Testing strategy": """Create a comprehensive testing strategy for this project. Include:
- Unit testing approach and tools
- Integration testing
- End-to-end testing
- Test coverage goals
- Performance testing
- Security testing
- Example test cases for key features
- Testing in CI/CD pipeline""",

    "Timeline": """Create a realistic project timeline. Include:
- Week-by-week breakdown for first 3 months
- Key milestones and deliverables
- Dependencies between tasks
- Risk buffer recommendations
- Team size assumptions
- MVP launch target
Format as a clear schedule with dates/weeks.""",

    "Team structure": """Recommend the ideal team structure for this project. Include:
- Required roles and responsibilities
- Recommended team size for MVP
- Skills required per role
- Collaboration tools and processes
- Meeting cadence
- Hiring priority order if building from scratch
- Freelance vs full-time recommendations""",
}

@app.post("/blueprint", response_model=BlueprintResponse)
def generate_blueprint(request: BlueprintRequest):
    section_prompt = SECTION_PROMPTS.get(
        request.section,
        "Provide detailed information about this aspect of the project."
    )

    prompt = f"""You are an expert software architect and development consultant.

Project Name: {request.project_name}
Project Description: {request.project_description}

Generate the "{request.section}" section of the development blueprint.

{section_prompt}

Be specific to this project, practical, and production-ready.
Use markdown formatting with clear headings, bullet points, and code blocks where appropriate.
Be thorough and detailed — this is a professional development blueprint."""

    content = llm.invoke(prompt).content

    return BlueprintResponse(
        section=request.section,
        content=content
    )

# =====================================
    

class AskRequest(BaseModel):
    message: str
    project_context: str | None = None
    history: list | None = []

class AskResponse(BaseModel):
    answer: str

@app.post("/ask", response_model=AskResponse)
def ask_ai(request: AskRequest):
    context = ""
    if request.project_context:
        context = f"You are helping with this specific project: {request.project_context}\n\n"

    history_text = ""
    if request.history:
        for msg in request.history:
            role = "User" if msg.get("role") == "user" else "Assistant"
            history_text += f"{role}: {msg.get('content', '')}\n"

    prompt = f"""{context}You are an expert software development consultant. Answer the following development question in a clear, practical, and detailed way. Use markdown formatting where helpful.

{f"Previous conversation:{chr(10)}{history_text}{chr(10)}" if history_text else ""}
User: {request.message}

Answer:"""

    answer = llm.invoke(prompt).content
    return AskResponse(answer=answer)

# =====================================

class TechRadarRequest(BaseModel):
    technology: str

class TechRadarResponse(BaseModel):
    technology: str
    ring: str
    scores: dict
    analysis: str

@app.post("/techradar", response_model=TechRadarResponse)
def tech_radar(request: TechRadarRequest):
    prompt = f"""You are a senior software architect evaluating technologies for the Tech Radar.

Evaluate: {request.technology}

Respond in this exact markdown format:

## Summary
(2-3 sentence overview of the technology)

## Recommendation
(Why it gets this ring rating)

## Pros
- (key advantage)
- (key advantage)
- (key advantage)

## Cons
- (key disadvantage)
- (key disadvantage)

## Best used for
(Ideal use cases)

## Alternatives
(List 2-3 alternatives with brief comparison)

After the analysis, on the very last line, output ONLY this JSON and nothing else:
SCORES: {{"maturity": X, "community": X, "performance": X, "learning_curve": X}}

Where X is a number from 1-10. learning_curve should be rated inversely (10 = very easy to learn).

Also determine the ring: Adopt, Trial, Assess, or Hold."""

    response = llm.invoke(prompt).content

    ring = "Assess"
    for r in ["Adopt", "Trial", "Assess", "Hold"]:
        if r.lower() in response.lower():
            ring = r
            break

    scores = {"maturity": 7, "community": 7, "performance": 7, "learning_curve": 7}
    try:
        scores_match = re.search(r'SCORES:\s*(\{[^}]+\})', response)
        if scores_match:
            scores = json.loads(scores_match.group(1))
            response = response[:scores_match.start()].strip()
    except:
        pass

    return TechRadarResponse(
        technology=request.technology,
        ring=ring,
        scores=scores,
        analysis=response
    )

# =====================================

class StackCompareRequest(BaseModel):
    technologies: list[str]
    use_case: str = "general development"

class StackCompareResponse(BaseModel):
    technologies: list[str]
    use_case: str
    winner: str
    scores: dict
    analysis: str

@app.post("/stackcompare", response_model=StackCompareResponse)
def stack_compare(request: StackCompareRequest):
    techs = ", ".join(request.technologies)
    scores_template = json.dumps({
        tech: {"performance": 0, "learning_curve": 0, "ecosystem": 0, "scalability": 0}
        for tech in request.technologies
    })

    prompt = f"""You are a senior software architect comparing technologies.

Compare these technologies: {techs}
Use case: {request.use_case}

Respond in this exact format:

## Overview
(Brief intro to the comparison)

{"".join([f"## {tech}{chr(10)}(2-3 sentence summary of this technology){chr(10)}{chr(10)}### Pros{chr(10)}- (advantage){chr(10)}- (advantage){chr(10)}{chr(10)}### Cons{chr(10)}- (disadvantage){chr(10)}- (disadvantage){chr(10)}{chr(10)}" for tech in request.technologies])}

## Verdict
(Which one wins for this use case and why)

## When to choose each
(Quick guide on which to pick based on different scenarios)

After the analysis output ONLY these two lines at the very end:
WINNER: <technology name>
SCORES: {scores_template}

Replace 0s with scores from 1-10 for each technology."""

    response = llm.invoke(prompt).content

    winner = request.technologies[0]
    scores = {tech: {"performance": 7, "learning_curve": 7, "ecosystem": 7, "scalability": 7} for tech in request.technologies}

    try:
        winner_match = re.search(r'WINNER:\s*(.+)', response)
        if winner_match:
            winner = winner_match.group(1).strip()

        scores_match = re.search(r'SCORES:\s*(\{.+\})', response, re.DOTALL)
        if scores_match:
            scores = json.loads(scores_match.group(1))

        cut = len(response)
        if "WINNER:" in response:
            cut = min(cut, response.find("WINNER:"))
        if "SCORES:" in response:
            cut = min(cut, response.find("SCORES:"))
        response = response[:cut].strip()
    except:
        pass

    return StackCompareResponse(
        technologies=request.technologies,
        use_case=request.use_case,
        winner=winner,
        scores=scores,
        analysis=response
    )