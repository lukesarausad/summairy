import { GoogleGenerativeAI } from '@google/generative-ai';
import * as cheerio from 'cheerio';
import axios from 'axios';
import dotenv from 'dotenv';


let current;
let last = [];
let all = [];


dotenv.config();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

 const modelDefault = genAI.getGenerativeModel({ model: "gemini-1.5-flash",
  systemInstruction: `You are a content creator for Inaka LABS, a groundbreaking initiative brought to you by the Future Economic Rural Network (FERN), 
aimed at unleashing the untapped potential of rural Japan through the development of rural startup hubs. We believe in a future where 
rural areas flourish with technology, innovation, and entrepreneurial spirit, contributing significantly to Japan's economic diversity 
and sustainability.`
  });

 let platform;


const parseArticle = async (url) => {
    try {
      const response = await axios.get(url);
      const html = response.data;
      const $ = cheerio.load(html);
      
      // Remove unwanted elements
      $('script').remove();
      $('style').remove();
      $('nav').remove();
      $('header').remove();
      $('footer').remove();
      $('.ads').remove();
      
      return {
        title: $('h1').first().text().trim(),
        content: $('article, .article-content, .content, main')
          .first()
          .text()
          .trim()
          .replace(/\s+/g, ' '),
      };
    } catch (error) {
      throw new Error(`Failed to parse article: ${error.message}`);
    }
  };


export const getSummary = async (req, res) => {
    try {

        const  query  = req.body.query;
        
        const  postType  = req.body.postType;

        if (current != undefined){
          last.push(current);
        }
        
        // Parse the article
        const article = await parseArticle(query);
    
        // Prompt and generate article    
        let prompt; 

        // recents.push({query : postType});
          // if (recents.size() > 3){
          // recents.pop();
          // }
        
        if (postType == "twitter"){
          prompt = `Your job is to summarize the article in less than 200 characters. Cater the post for an audience on X. Remember that 
          you are referencing the article, not writing a new one. Include relevant hashtags along with a #inakaLABS. Make sure to not start with the 
          word Japan. Here is the article

          Article content: ${article.content};`;

          const result = await modelDefault.generateContent(prompt);
          const summary = result.response.text();

          current = {originalArticle: article, summary: summary, url: query};
          all.push(current);

    
          // Send response in linkedin format
          res.json(
            current
          );
        }
        else if (postType == "linkedin"){
          prompt = `Your job is to create an opioniated post given the article, follow the given formula to create a post. Cater the post to an audience on Linkedin. 
          Follow the given formula to create a post: 1. Article summary 2. Hot take: this is how our approach is different/more interesting/better 3. 
          Call to action Combine the summary, hot take and call to action in a single continuous paragraph with no line breaks. Add relevant hashtags along with a #inakaLABS. 
          Make sure to not start with the word Japan.
 
          Article content: ${article.content};`

          const result = await modelDefault.generateContent(prompt);
          const summary = result.response.text();
    
          current = {originalArticle: article, summary: summary, url: query};
          all.push(current);
          // Send response in twitter format
          res.json(current);
        } else {
            prompt = `Please provide a comprehensive summary of the following article. 
            Focus on the main points, key findings, and important conclusions.
        
            Title: ${article.title}
            Content: ${article.content.substring(0, 30000)}
        
            Please structure the summary as follows:
            1. Brief overview (2-3 sentences)
            2. Main points and key arguments
            3. Important conclusions or implications
            4. Any significant data or statistics mentioned`;
            const result = await modelDefault.generateContent(prompt);
            const summary = result.response.text();
      
            current = {originalArticle: article, summary: summary, url: query};
            all.push(current);
            
            // Send response
            res.json(current);
        
          }
    
      } catch (error) {
        console.error('Error in getSummary:', error);
        res.status(500).json({
          error: 'Failed to generate summary',
          details: error.message,
          url: req.body.query
        });
      }
    };

    export const getLast = async (req, res) => {
      if (last.length === 0){
        res.status(500).json({
          error: 'No last response',
        });
      } else {
        const response = last.pop();
        res.json(response);
      }
    };

    export const displayHistory = async (req, res) => {
      res.json(all);
    }

