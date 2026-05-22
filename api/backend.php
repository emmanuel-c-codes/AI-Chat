<?php
// backend.php
session_start();
header('Content-Type: application/json');

// Handle clearing the chat session if requested
if (isset($_GET['action']) && $_GET['action'] === 'clear') {
    $_SESSION['chat_history'] = [];
    echo json_encode(['status' => 'cleared']);
    exit;
}

// Grab raw input from frontend JavaScript
$inputData = json_decode(file_get_contents('php://input'), true);
$userMessage = $inputData['message'] ?? '';

if (empty($userMessage)) {
    echo json_encode(['reply' => 'I didn\'t catch that. Please type something!']);
    exit;
}

// Initialize chat history array in the session if it doesn't exist yet
if (!isset($_SESSION['chat_history'])) {
    $_SESSION['chat_history'] = [];
}

// Append the new user message to our history array
$_SESSION['chat_history'][] = [
    "role" => "user",
    "parts" => [["text" => $userMessage]]
];

// -----------------------------------------------------------------
// CONFIGURATION: Secure production setup using Environment Variables
// -----------------------------------------------------------------
// Safely pulls the key from Vercel's backend environment context so it NEVER leaks on GitHub
$apiKey = $_ENV['GEMINI_API_KEY'] ?? getenv('GEMINI_API_KEY') ?? ""; 

if (empty($apiKey)) {
    echo json_encode(['reply' => 'System configuration error: API Key is missing from the server environment settings. Did you forget to add GEMINI_API_KEY to your Vercel Dashboard?']);
    exit;
}

$apiUrl = "https://generativelanguage.googleapis.com/v1/models/gemini-3.5-flash:generateContent?key=" . $apiKey;

// Structure the payload with the COMPLETE history
$payload = [
    "contents" => $_SESSION['chat_history']
];

// Send the request to the API via cURL
$ch = curl_init($apiUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);

$response = curl_exec($ch);
curl_close($ch);

// Parse the reply and update history
if ($response) {
    $result = json_decode($response, true);
    
    // Check standard Gemini text response nesting path
    if (isset($result['candidates'][0]['content']['parts'][0]['text'])) {
        $aiReply = $result['candidates'][0]['content']['parts'][0]['text'];
    } 
    // Fallback block: If there is an API error message from Google, show it directly for debugging
    else if (isset($result['error']['message'])) {
        $aiReply = "API Error: " . $result['error']['message'];
    } 
    // General fallback if format is entirely unrecognized
    else {
        $aiReply = "Unrecognized response format. Raw API Output: " . substr(strip_tags($response), 0, 150);
    }
    
    // Only save to history if it's a valid non-error response
    if (!isset($result['error'])) {
        $_SESSION['chat_history'] = [];
        $_SESSION['chat_history'][] = [
            "role" => "model",
            "parts" => [["text" => $aiReply]]
        ];
    }
    
    echo json_encode(['reply' => $aiReply]);
} else {
    echo json_encode(['reply' => 'Backend error: Unable to reach the AI network via cURL.']);
}
?>