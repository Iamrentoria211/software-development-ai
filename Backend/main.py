import os
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