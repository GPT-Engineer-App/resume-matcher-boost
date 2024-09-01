import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
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
  const [email, setEmail] = useState('');
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [downloadType, setDownloadType] = useState('');

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
      highlightedText = highlightedText.replace(regex, match => `<span style="background-color: yellow;">${match}</span>`);
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

  const handleDownload = (type) => {
    setDownloadType(type);
    setShowEmailDialog(true);
  };

  const downloadFile = () => {
    if (!email) {
      setError('Please enter a valid email address.');
      return;
    }
    setShowEmailDialog(false);
    
    if (downloadType === 'resume') {
      exportResume('pdf');
    } else if (downloadType === 'coverLetter') {
      exportCoverLetter('pdf');
    }
  };

  const exportCoverLetter = (format) => {
    switch (format) {
      case 'pdf':
        const doc = new jsPDF();
        doc.text(coverLetter, 10, 10);
        doc.save("cover_letter.pdf");
        break;
      case 'docx':
        const doc2 = new Document({
          sections: [{
            properties: {},
            children: [
              new Paragraph({
                children: [new TextRun(coverLetter)],
              }),
            ],
          }],
        });
        Packer.toBlob(doc2).then(blob => {
          saveAs(blob, "cover_letter.docx");
        });
        break;
      default:
        alert('Invalid format selected');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Resume Optimizer</h1>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2">
            <li>Paste your resume and the job description into the provided fields.</li>
            <li>Our AI analyzes your resume against the job requirements.</li>
            <li>We highlight matching keywords and identify skill gaps.</li>
            <li>Get an optimized resume and a tailored cover letter.</li>
            <li>Download your improved documents to increase your chances of passing ATS scans.</li>
          </ol>
        </CardContent>
      </Card>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Input Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <label htmlFor="resume" className="block text-sm font-medium text-gray-700 mb-1">Resume</label>
              <Textarea
                id="resume"
                value={resume}
                onChange={(e) => setResume(e.target.value)}
                placeholder="Paste your resume here"
                className="mt-1 h-40"
              />
            </div>
            <div>
              <label htmlFor="jobDescription" className="block text-sm font-medium text-gray-700 mb-1">Job Description</label>
              <Textarea
                id="jobDescription"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description here"
                className="mt-1 h-40"
              />
            </div>
            <div>
              <label htmlFor="companyWebsite" className="block text-sm font-medium text-gray-700 mb-1">Company Website</label>
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
              <label htmlFor="template" className="block text-sm font-medium text-gray-700 mb-1">Resume Template</label>
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
            <div className="flex flex-wrap gap-4">
              <Button onClick={analyzeResume}>Analyze Resume</Button>
              <Button onClick={generateCoverLetter}>Generate Cover Letter</Button>
              <Button onClick={saveResume}>Save Resume</Button>
              <Button onClick={loadResume}>Load Resume</Button>
              <Button onClick={aiRewrite}>AI Rewrite</Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {error && <p className="text-red-500 mb-4">{error}</p>}
      
      {matchPercentage !== null && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Resume Analysis Results</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-semibold mb-4">Resume Matching Score: {matchPercentage}%</p>
            <p className="mb-2">Missing Keywords: {missingKeywords.join(', ')}</p>
            <h3 className="font-bold mt-4 mb-2">Skill Gap Analysis:</h3>
            <ul className="list-disc list-inside">
              {skillGap.map((skill, index) => (
                <li key={index}>{skill}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
      
      {optimizedResume && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Optimized Resume</CardTitle>
          </CardHeader>
          <CardContent>
            <div dangerouslySetInnerHTML={{ __html: optimizedResume }} />
            <Button className="mt-4" onClick={() => handleDownload('resume')}>Download Optimized Resume</Button>
          </CardContent>
        </Card>
      )}
      
      {coverLetter && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Generated Cover Letter</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={coverLetter}
              readOnly
              className="mt-1 h-64"
            />
            <Button className="mt-4" onClick={() => handleDownload('coverLetter')}>Download Cover Letter</Button>
          </CardContent>
        </Card>
      )}

      <Dialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter your email to download</DialogTitle>
          </DialogHeader>
          <Input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button onClick={downloadFile}>Download</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;