import { Client } from "@langchain/langgraph-sdk";
import { AIUserProfile } from "../dto/response";

export interface ChatMessage {
    id: string;
    text: string;
    timestamp: Date;
    role: 'user' | 'assistant';
}

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

interface ChatThreadState {
    messages: Message[];
    // Add other state properties as needed
}


export class AIService {
    private static client = new Client({
        apiUrl: process.env.LANGGRAPH_URL || 'http://localhost:2024',
        apiKey: process.env.LANGGRAPH_API_KEY,
    });

    private static async getDefaultAssistant() {
        const assistants = await this.client.assistants.search({
            metadata: null,
            offset: 0,
            limit: 1,
        });
        return assistants[0];
    }

    static async createThread() {
        try {
            return await this.client.threads.create();
        } catch (error) {
            console.error('Error creating thread:', error);
            throw error;
        }
    }

    static async listRuns(threadId: string) {
        try {
            return await this.client.runs.list(threadId);
        } catch (error) {
            console.error('Error listing runs:', error);
            throw error;
        }
    }

    static async* streamResponse(threadId: string, message: string) {
        try {
            const assistant = await this.getDefaultAssistant();
            const messages = [{ role: "human", content: message }];

            const streamResponse = this.client.runs.stream(
                threadId,
                assistant.assistant_id,
                {
                    input: { messages },
                    streamMode: "messages"
                }
            );

            for await (const chunk of streamResponse) {
                if (chunk.event === "messages/partial") {
                    yield {
                        id: Date.now().toString(),
                        text: chunk.data[0].content,
                        timestamp: new Date(),
                        role: 'assistant'
                    } as ChatMessage;
                }
            }
        } catch (error) {
            console.error('Error streaming response:', error);
            throw error;
        }
    }

    static async sendMessageWithWait(threadId: string, message: AIUserProfile): Promise<AIUserProfile> {
        try {
            const assistant = await this.getDefaultAssistant();
            const messages = [{ role: "human" as const, user_profile: JSON.stringify(message) }];
            // console.log("Messages", JSON.stringify(messages))

            // Using wait to create and wait for a run
            // The wait method returns the thread values, not directly the messages
            const threadValues = await this.client.runs.wait(
                threadId,
                assistant.assistant_id,
                {
                    input: {user_profile: message}
                }
            );
            
            // After the run completes, we need to get the thread state
            // to access the messages properly
            const threadState = await this.client.threads.getState<ChatThreadState>(threadId);

            const recommendedMeals: AIUserProfile = threadState["metadata"]?.writes?.write_recommendations as AIUserProfile

            // console.log("ThreadState", JSON.stringify(threadState["metadata"]?.writes?.write_recommendations))

            return recommendedMeals
        } catch (error) {
            console.error('Error sending message:', error);
            throw error;
        }
    }

    static async sendMessageWithoutWait(threadId: string, message: AIUserProfile): Promise<void> {
        try {
            const assistant = await this.getDefaultAssistant();
            
            // Create a run without waiting for completion
            await this.client.runs.create(
                threadId,
                assistant.assistant_id,
                {
                    input: {user_profile: message}
                }
            );
        } catch (error) {
            console.error('Error sending message without wait:', error);
            throw error;
        }
    }

    // static async sendMessage(message: string): Promise<ChatMessage> {
    //   try {
    //     const thread = await this.createThread();
    //     const response = this.streamResponse(thread.thread_id, message);

    //     const firstResponse = await response.next();
    //     if (!firstResponse.value) {
    //       throw new Error('No response received from assistant');
    //     }
    //     return firstResponse.value;
    //   } catch (error) {
    //     console.error('Error sending message:', error);
    //     throw error;
    //   }
    // }

} 