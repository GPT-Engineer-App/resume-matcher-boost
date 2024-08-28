import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import axios from 'axios';
import { jsPDF } from "jspdf";
import { saveAs } from 'file-saver';
import { Document, Packer, Paragraph, TextRun } from "docx";

const Index = () => {
  const [resume, setResume] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [companyWebsite, setCompanyWebsite] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [error, setError] = useState('');
  const [matchPercentage, setMatchPercentage] = useState(null);
  const [missingKeywords, setMissingKeywords] = useState([]);
  const [highlightedResume, setHighlightedResume] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [optimizedResume, setOptimizedResume] = useState('');
  const [skillGap, setSkillGap] = useState([]);

  useEffect(() => {
    if (resume && jobDescription) {
      highlightKeywords();
      performSkillGapAnalysis();
    }
  }, [resume, jobDescription]);

  const analyzeResume = () => {
    if (!resume || !jobDescription) {
      setError('Please provide both a resume and job description for analysis.');
      return;
    }
    setError('');

    const jobKeywords = extractKeywords(jobDescription);
    const resumeKeywords = extractKeywords(resume);

    const matchedKeywords = jobKeywords.filter(keyword => resumeKeywords.includes(keyword));
    const percentage = (matchedKeywords.length / jobKeywords.length) * 100;
    setMatchPercentage(percentage.toFixed(2));

    const missing = jobKeywords.filter(keyword => !resumeKeywords.includes(keyword));
    setMissingKeywords(missing);

    optimizeResume();
  };

  const extractKeywords = (text) => {
    const words = text.toLowerCase().match(/\b(\w+)\b/g);
    const keywords = [...new Set(words)];
    return keywords.filter(word => word.length > 3);
  };

  const highlightKeywords = () => {
    const jobKeywords = extractKeywords(jobDescription);
    let highlightedText = resume;

    jobKeywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      highlightedText = highlightedText.replace(regex, match => `<span style="background-color: lightgreen;">${match}</span>`);
    });

    setHighlightedResume(highlightedText);
  };

  const performSkillGapAnalysis = () => {
    const jobSkills = extractSkills(jobDescription);
    const resumeSkills = extractSkills(resume);

    const missingSkills = jobSkills.filter(skill => !resumeSkills.includes(skill));
    setSkillGap(missingSkills);
  };

  const extractSkills = (text) => {
    // This is a simplified skill extraction. In a real-world scenario, you'd use a more sophisticated NLP approach.
    const skillKeywords = ['python', 'javascript', 'react', 'node.js', 'sql', 'machine learning', 'data analysis', 'project management', 'agile', 'scrum', 'leadership', 'communication', 'teamwork', 'problem-solving'];
    return skillKeywords.filter(skill => text.toLowerCase().includes(skill));
  };

  const optimizeResume = () => {
    let optimized = resume;

    // Replace weak verbs with strong action verbs
    const weakVerbs = {
      'worked on': 'developed',
      'responsible for': 'managed',
      'helped': 'assisted',
      'did': 'executed',
    };

    Object.entries(weakVerbs).forEach(([weak, strong]) => {
      const regex = new RegExp(`\\b${weak}\\b`, 'gi');
      optimized = optimized.replace(regex, `<span style="background-color: yellow;">${strong}</span>`);
    });

    // Highlight key skills
    const keySkills = extractSkills(jobDescription);
    keySkills.forEach(skill => {
      const regex = new RegExp(`\\b${skill}\\b`, 'gi');
      optimized = optimized.replace(regex, `<span style="background-color: yellow;">${skill}</span>`);
    });

    setOptimizedResume(optimized);
  };

  const generateCoverLetter = async () => {
    if (!resume || !jobDescription || !companyWebsite) {
      setError('Please provide a resume, job description, and company website to generate a cover letter.');
      return;
    }
    setError('');

    try {
      const response = await axios.get(companyWebsite);
      const companyInfo = response.data;

      const name = extractName(resume);
      const keySkills = extractKeySkills(resume);
      const jobTitle = extractJobTitle(jobDescription);
      const companyName = extractCompanyName(companyInfo);
      const companyMission = extractCompanyMission(companyInfo);

      const generatedCoverLetter = `
Dear Hiring Manager,

I am writing to express my strong interest in the ${jobTitle} position at ${companyName}. As an experienced professional with a background in ${keySkills.join(', ')}, I am excited about the opportunity to contribute to your team and help further your mission of ${companyMission}.

${generatePersonalizedParagraph(resume, jobDescription, companyInfo)}

${generateSkillsAndExperienceParagraph(resume, jobDescription)}

${generateClosingParagraph(companyName)}

Sincerely,
${name}
      `;

      setCoverLetter(generatedCoverLetter);
    } catch (error) {
      setError('Error generating cover letter. Please check the company website URL and try again.');
    }
  };

  const extractName = (resume) => {
    // Implement logic to extract name from resume
    return "Your Name";
  };

  const extractKeySkills = (resume) => {
    // Implement logic to extract key skills from resume
    return ["skill1", "skill2", "skill3"];
  };

  const extractJobTitle = (jobDescription) => {
    // Implement logic to extract job title from job description
    return "Position Title";
  };

  const extractCompanyName = (companyInfo) => {
    // Implement logic to extract company name from company info
    return "Company Name";
  };

  const extractCompanyMission = (companyInfo) => {
    // Implement logic to extract company mission from company info
    return "company mission statement";
  };

  const generatePersonalizedParagraph = (resume, jobDescription, companyInfo) => {
    // Implement logic to generate a personalized paragraph
    return "This is a personalized paragraph based on your resume, the job description, and company information.";
  };

  const generateSkillsAndExperienceParagraph = (resume, jobDescription) => {
    // Implement logic to generate a paragraph about skills and experience
    return "This paragraph highlights your relevant skills and experience for the position.";
  };

  const generateClosingParagraph = (companyName) => {
    // Implement logic to generate a closing paragraph
    return `I am excited about the possibility of joining ${companyName} and would welcome the opportunity to discuss how my skills and experiences align with your needs. Thank you for your consideration, and I look forward to speaking with you soon.`;
  };

  const saveResume = () => {
    localStorage.setItem('savedResume', optimizedResume);
    alert('Resume saved successfully!');
  };

  const loadResume = () => {
    const savedResume = localStorage.getItem('savedResume');
    if (savedResume) {
      setResume(savedResume);
      setOptimizedResume(savedResume);
    } else {
      alert('No saved resume found.');
    }
  };

  const exportResume = (format) => {
    switch (format) {
      case 'pdf':
        const doc = new jsPDF();
        doc.text(optimizedResume, 10, 10);
        doc.save("optimized_resume.pdf");
        break;
      case 'docx':
        const doc2 = new Document({
          sections: [{
            properties: {},
            children: [
              new Paragraph({
                children: [new TextRun(optimizedResume)],
              }),
            ],
          }],
        });
        Packer.toBlob(doc2).then(blob => {
          saveAs(blob, "optimized_resume.docx");
        });
        break;
      case 'txt':
        const blob = new Blob([optimizedResume], {type: "text/plain;charset=utf-8"});
        saveAs(blob, "optimized_resume.txt");
        break;
      default:
        alert('Invalid format selected');
    }
  };

  const aiRewrite = () => {
    // This is a placeholder for AI-powered rewriting
    // In a real implementation, you'd call an AI service here
    const rewrittenResume = resume.replace(
      /(Worked as a |Responsible for |Helped with )/g,
      match => `<span style="background-color: yellow;">${match.replace(/Worked as a |Responsible for |Helped with /, 'Led ')}</span>`
    );
    setOptimizedResume(rewrittenResume);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Advanced Resume Optimizer and Cover Letter Generator</h1>
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Input Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label htmlFor="resume" className="block text-sm font-medium text-gray-700">Resume</label>
              <Textarea
                id="resume"
                value={resume}
                onChange={(e) => setResume(e.target.value)}
                placeholder="Paste your resume here"
                className="mt-1"
              />
            </div>
            <div>
              <label htmlFor="jobDescription" className="block text-sm font-medium text-gray-700">Job Description</label>
              <Textarea
                id="jobDescription"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description here"
                className="mt-1"
              />
            </div>
            <div>
              <label htmlFor="companyWebsite" className="block text-sm font-medium text-gray-700">Company Website</label>
              <Input
                id="companyWebsite"
                type="url"
                value={companyWebsite}
                onChange={(e) => setCompanyWebsite(e.target.value)}
                placeholder="https://www.company.com"
                className="mt-1"
              />
            </div>
            <div>
              <label htmlFor="template" className="block text-sm font-medium text-gray-700">Resume Template</label>
              <Select onValueChange={setSelectedTemplate}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a template" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="classic">Classic</SelectItem>
                  <SelectItem value="modern">Modern</SelectItem>
                  <SelectItem value="creative">Creative</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex space-x-4">
              <Button onClick={analyzeResume}>Analyze Resume</Button>
              <Button onClick={generateCoverLetter}>Generate Cover Letter</Button>
              <Button onClick={saveResume}>Save Resume</Button>
              <Button onClick={loadResume}>Load Resume</Button>
              <Button onClick={aiRewrite}>AI Rewrite</Button>
            </div>
            <div className="flex space-x-4">
              <Button onClick={() => exportResume('pdf')}>Export as PDF</Button>
              <Button onClick={() => exportResume('docx')}>Export as DOCX</Button>
              <Button onClick={() => exportResume('txt')}>Export as TXT</Button>
            </div>
          </div>
        </CardContent>
      </Card>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {matchPercentage !== null && (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Resume Analysis Results</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Match Percentage: {matchPercentage}%</p>
            <p>Missing Keywords: {missingKeywords.join(', ')}</p>
            <h3 className="font-bold mt-4">Skill Gap Analysis:</h3>
            <ul>
              {skillGap.map((skill, index) => (
                <li key={index}>{skill}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
      {optimizedResume && (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Optimized Resume</CardTitle>
          </CardHeader>
          <CardContent>
            <div dangerouslySetInnerHTML={{ __html: optimizedResume }} />
          </CardContent>
        </Card>
      )}
      {coverLetter && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Cover Letter</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={coverLetter}
              readOnly
              className="mt-1 h-64"
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Index;
