from langchain_ollama import OllamaLLM as Ollama
from langchain_community.tools import DuckDuckGoSearchRun
from langchain_core.prompts import PromptTemplate
from langchain_core.tools import Tool

llm = Ollama(model="phi3")

search = DuckDuckGoSearchRun()

def research_agent(topic):
    print(f"\nResearching: {topic}\n")
    
    print("Searching the web...")
    search_query = f"{topic} latest information 2025"
    result1 = search.run(search_query)
    print(f"Search 1 done.\n")
    
    search_query2 = f"{topic} key facts and developments"
    result2 = search.run(search_query2)
    print(f"Search 2 done.\n")
    
    search_query3 = f"{topic} future outlook"
    result3 = search.run(search_query3)
    print(f"Search 3 done.\n")
    
    print("Writing report with Phi3...\n")
    
    prompt = f"""You are a research assistant. Based on the following search results, write a detailed research report about: {topic}

SEARCH RESULT 1:
{result1}

SEARCH RESULT 2:
{result2}

SEARCH RESULT 3:
{result3}

Write a well-structured report with:
1. Introduction
2. Key Findings
3. Conclusion

Report:"""
    
    report = llm.invoke(prompt)
    return report

if __name__ == "__main__":
    topic = input("Enter a research topic: ")
    report = research_agent(topic)
    print("\n===== FINAL REPORT =====\n")
    print(report)