import React, { useState, useCallback, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useDropzone } from 'react-dropzone';
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const FileUpload = ({ onFileUpload }) => {
  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      onFileUpload(e.target.result);
    };
    reader.readAsText(file);
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: '.txt,.pdf,.doc,.docx' });

  return (
    <div {...getRootProps()} className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center cursor-pointer">
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the file here ...</p>
      ) : (
        <p>Drag 'n' drop a file here, or click to select a file</p>
      )}
    </div>
  );
};

const Index = () => {
  const [resume, setResume] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [adjustedResume, setAdjustedResume] = useState('');
  const [matchScore, setMatchScore] = useState(0);
  const [suggestions, setSuggestions] = useState([]);
  const [error, setError] = useState('');
  const [keywords, setKeywords] = useState([]);
  const [savedResumes, setSavedResumes] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [missingSkills, setMissingSkills] = useState([]);
  const [aiSuggestions, setAiSuggestions] = useState({});

  const handleResumeChange = (e) => setResume(e.target.value);
  const handleJobDescriptionChange = (e) => setJobDescription(e.target.value);
  const handleFileUpload = (content) => setResume(content);

  const saveResume = () => {
    const newSavedResume = { id: Date.now(), name: `Resume ${savedResumes.length + 1}`, content: adjustedResume };
    setSavedResumes([...savedResumes, newSavedResume]);
    localStorage.setItem('savedResumes', JSON.stringify([...savedResumes, newSavedResume]));
  };

  const loadResume = (id) => {
    const loadedResume = savedResumes.find(resume => resume.id === id);
    if (loadedResume) {
      setResume(loadedResume.content);
    }
  };

  useEffect(() => {
    const storedResumes = localStorage.getItem('savedResumes');
    if (storedResumes) {
      setSavedResumes(JSON.parse(storedResumes));
    }
  }, []);

  const analyzeResume = () => {
    if (!resume || !jobDescription) {
      setError('Please provide both a resume and a job description.');
      return;
    }
    setError('');

    // Extract keywords from job description
    const jobKeywords = jobDescription.toLowerCase().match(/\b\w+\b/g) || [];
    const uniqueJobKeywords = [...new Set(jobKeywords)];

    // Find matching keywords in resume
    const matchingKeywords = uniqueJobKeywords.filter(keyword => 
      resume.toLowerCase().includes(keyword)
    );

    setKeywords(matchingKeywords);

    // Highlight matching keywords in resume
    let highlightedResume = resume;
    matchingKeywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      highlightedResume = highlightedResume.replace(regex, match => 
        `<span class="bg-green-200">${match}</span>`
      );
    });

    setAdjustedResume(highlightedResume);
    setMatchScore(Math.round((matchingKeywords.length / uniqueJobKeywords.length) * 100));

    // Identify missing skills
    const missingSkills = uniqueJobKeywords.filter(keyword => 
      !resume.toLowerCase().includes(keyword)
    );
    setMissingSkills(missingSkills);

    setSuggestions([
      "Add more keywords related to the job description",
      "Quantify your achievements with specific metrics",
      "Use action verbs to describe your experiences"
    ]);

    // AI-powered rewriting suggestions (placeholder)
    setAiSuggestions({
      summary: "Consider rephrasing your summary to highlight your most relevant skills.",
      experience: "Try to quantify your achievements in each role with specific metrics.",
      skills: "Add some of the missing skills identified in the analysis."
    });
  };

  const exportResume = (format) => {
    let content = adjustedResume;
    let mimeType = 'text/plain';
    let fileExtension = 'txt';

    if (format === 'pdf') {
      // For PDF, we'd typically use a library like jsPDF
      // This is a placeholder for the concept
      mimeType = 'application/pdf';
      fileExtension = 'pdf';
    } else if (format === 'docx') {
      // For DOCX, we'd typically use a library like docx
      // This is a placeholder for the concept
      mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      fileExtension = 'docx';
    }

    const blob = new Blob([content], { type: mimeType });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `optimized_resume.${fileExtension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container mx-auto p-4">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">ATS-Friendly Resume Optimizer</h1>
        <p className="text-xl text-muted-foreground">Improve your resume's chances of passing Applicant Tracking Systems</p>
      </header>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2">
            <li>Upload or paste your resume in the "Resume" tab.</li>
            <li>Paste the job description in the "Job Description" tab.</li>
            <li>Click "Analyze and Optimize" to process your resume.</li>
            <li>Review the match score, suggestions, and optimized resume.</li>
            <li>Use the optimized version to improve your chances with ATS systems.</li>
          </ol>
          <p className="mt-4 text-sm text-muted-foreground">
            Our tool analyzes your resume against the job description, identifying key terms and suggesting improvements to increase your chances of passing Applicant Tracking Systems (ATS).
          </p>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Input</CardTitle>
            <CardDescription>Upload or paste your resume and the job description</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="resume">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="resume">Resume</TabsTrigger>
                <TabsTrigger value="job">Job Description</TabsTrigger>
              </TabsList>
              <TabsContent value="resume">
                <div className="space-y-4">
                  <FileUpload onFileUpload={handleFileUpload} />
                  <Select onValueChange={setSelectedTemplate}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a template" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="chronological">Chronological</SelectItem>
                      <SelectItem value="functional">Functional</SelectItem>
                      <SelectItem value="combination">Combination</SelectItem>
                    </SelectContent>
                  </Select>
                  <Textarea
                    placeholder="Or paste your resume here"
                    className="min-h-[200px]"
                    value={resume}
                    onChange={handleResumeChange}
                  />
                </div>
              </TabsContent>
              <TabsContent value="job">
                <Textarea
                  placeholder="Paste the job description here"
                  className="min-h-[300px]"
                  value={jobDescription}
                  onChange={handleJobDescriptionChange}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter>
            <Button onClick={analyzeResume} className="w-full">Compare and Optimize</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Results</CardTitle>
            <CardDescription>ATS-optimized resume and suggestions</CardDescription>
          </CardHeader>
          <CardContent>
            {adjustedResume ? (
              <>
                <div className="mb-4">
                  <Label>Match Score</Label>
                  <Progress value={matchScore} className="mt-2" />
                  <p className="text-sm text-muted-foreground mt-1">{matchScore}% match with job description</p>
                </div>
                <div className="mb-4">
                  <Label>Keyword Suggestions</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {keywords.map((keyword, index) => (
                      <Badge key={index} variant="secondary">{keyword}</Badge>
                    ))}
                  </div>
                </div>
                <div className="mb-4">
                  <Label>Skill Gap Analysis</Label>
                  <ul className="list-disc list-inside text-sm text-muted-foreground mt-2">
                    {missingSkills.map((skill, index) => (
                      <li key={index}>Consider adding: {skill}</li>
                    ))}
                  </ul>
                </div>
                <div className="mb-4">
                  <Label>AI-Powered Improvement Suggestions</Label>
                  <ul className="list-disc list-inside text-sm text-muted-foreground mt-2">
                    {Object.entries(aiSuggestions).map(([section, suggestion], index) => (
                      <li key={index}><strong>{section}:</strong> {suggestion}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <Label>Optimized Resume</Label>
                  <ScrollArea className="h-[200px] mt-2 p-4 border rounded-md">
                    <div className="text-sm whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: adjustedResume }} />
                  </ScrollArea>
                </div>
                <div className="mt-4 space-x-2">
                  <Button onClick={() => exportResume('txt')}>Export as TXT</Button>
                  <Button onClick={() => exportResume('pdf')}>Export as PDF</Button>
                  <Button onClick={() => exportResume('docx')}>Export as DOCX</Button>
                </div>
              </>
            ) : (
              <p className="text-center text-muted-foreground">Upload a resume and job description, then click "Compare and Optimize" to see results.</p>
            )}
          </CardContent>
        </Card>
      </div>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="mt-4">Save/Load Resume</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Save or Load Resume</DialogTitle>
            <DialogDescription>
              Save your current resume or load a previously saved one.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input id="name" value={`Resume ${savedResumes.length + 1}`} className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={saveResume}>Save Current Resume</Button>
          </DialogFooter>
          <div className="mt-4">
            <Label>Saved Resumes</Label>
            <ScrollArea className="h-[200px] w-full border rounded-md p-4">
              {savedResumes.map((savedResume) => (
                <div key={savedResume.id} className="flex justify-between items-center mb-2">
                  <span>{savedResume.name}</span>
                  <Button onClick={() => loadResume(savedResume.id)}>Load</Button>
                </div>
              ))}
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
