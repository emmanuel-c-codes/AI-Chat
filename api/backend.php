<?php
// api/backend.php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: POST, OPTIONS');

// Handle preflight OPTIONS requests for CORS safety
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Grab incoming payload from JavaScript
$inputData = json_decode(file_get_contents('php://input'), true);
$history = $inputData['history'] ?? [];

if (empty($history)) {
    echo json_encode(['reply' => 'System received an empty conversation stream. Please try again.']);
    exit;
}

// -----------------------------------------------------------------
// CONFIGURATION: Safe environment lookup for production
// -----------------------------------------------------------------
$apiKey = $_ENV['GEMINI_API_KEY'] ?? getenv('GEMINI_API_KEY') ?? "";

if (empty($apiKey)) {
    echo json_encode(['reply' => 'System configuration error: GEMINI_API_KEY environment variable is missing on the host.']);
    exit;
}

$apiUrl = "https://generativelanguage.googleapis.com/v1/models/gemini-3.5-flash:generateContent?key=" . $apiKey;

// Prepare data payload structure directly for Google's API
$payload = [
    "contents" => $history
];

// Execute communication via cURL
$ch = curl_init($apiUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);

$response = curl_exec($ch);
curl_close($ch);

if ($response) {
    $result = json_decode($response, true);
    
    if (isset($result['candidates'][0]['content']['parts'][0]['text'])) {
        $aiReply = $result['candidates'][0]['content']['parts'][0]['text'];
    } else if (isset($result['error']['message'])) {
        $aiReply = "Google Engine Error: " . $result['error']['message'];
    } else {
        $aiReply = "Unrecognized API payload format.";
    }
    
    echo json_encode(['reply' => $aiReply]);
} else {
    echo json_encode(['reply' => 'Serverless timeout: Unable to forward network traffic to the AI engine.']);
}
?>