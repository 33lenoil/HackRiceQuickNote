import youtube_transcript_api
from youtube_transcript_api import YouTubeTranscriptApi
import warnings
warnings.filterwarnings(action='ignore', category=UserWarning, module='gensim')
import sys

import gensim
# from gensim.summarization import summarize
import sumy
from sumy.parsers.plaintext import PlaintextParser
from sumy.nlp.tokenizers import Tokenizer
from sumy.summarizers.lex_rank import LexRankSummarizer
from sumy.summarizers.luhn import LuhnSummarizer
from sumy.nlp.stemmers import Stemmer
from sumy.utils import get_stop_words
import pandas as pd
import numpy as np
import nltk
import csv
nltk.download('punkt')

# from Bert-Extractive_package
# from summarizer import Summarizer


def read_transcript_Dataframe(video_id):
    raw_transcript = YouTubeTranscriptApi.get_transcript(video_id)
    df1 = pd.DataFrame(raw_transcript)
    return df1


def store_transcript_CSV(fname, video_id):
    raw_transcript = YouTubeTranscriptApi.get_transcript(video_id)

    header = ["Text", "Start time(s)", "Duration (s)"]
    # print(len(raw_transcript))
    with open(fname, 'w', encoding='utf-8') as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(header)
        for transcript_line in raw_transcript:
            str1 = transcript_line["text"]
            list1 = str1.splitlines()
            str_increment = " ".join([elem for elem in list1])
            writer.writerow([str_increment, transcript_line["start"], transcript_line["duration"]])


def read_transcript_str(df1):
    doc = " ".join(map(str, df1["text"]))
    return doc

def clean_additional_stopwords(sentence1, additional_stopwords=["Um, ","Uh, ","um, ", "uh, ", "[NOISE] "]):
    sentence2 = str(sentence1)
    for str1 in additional_stopwords:
        sentence2 = sentence2.replace(str1, "")
    #clean_sentence = sentence2.replace("", "")
    #clean_sentence = clean_sentence.replace("Um, ", "")
    #clean_sentence = clean_sentence.replace("Uh, ", "")
    #clean_sentence = clean_sentence.replace("um, ", "")
    #clean_sentence = clean_sentence.replace("uh, ", "")
    #clean_sentence = clean_sentence.replace("[NOISE] ", "")
    # print(sentence2)
    return sentence2

def run_Luhn(raw_text, language, num_sentence):
    # print(language, num_sentence)
    my_parser = PlaintextParser.from_string(raw_text, Tokenizer(language))

    stemmer = Stemmer(language)

    luhn_summarizer = LuhnSummarizer(stemmer)
    luhn_summarizer.stop_words = get_stop_words(language)
    luhn_summary = luhn_summarizer(my_parser.document, num_sentence)

    summary_list = []
    for sentence in luhn_summary:
        sentence1 = str(sentence)
        clean_sentence = clean_additional_stopwords(sentence1)
        summary_list.append(clean_sentence)

    return summary_list

'''
def run_bert_extractive(raw_text, num_sentence):
    body = raw_text
    model = Summarizer()
    # result = model(body, ratio=0.2)  # Specified with ratio
    result = model(body, min_length=100, max_length=2000, num_sentences=num_sentence)

    summary_list = []
    for sentence in result.split("."):
        summary_list.append(sentence)
    return summary_list
'''

def run_textRank(raw_text, ratio1 = 0.02):
    # summarize is imported from gensim
    short_summary = summarize(raw_text, ratio=ratio1)
    summary_list = short_summary.replace("\n", "").split(".")
    return summary_list

def main (video_id, model, num_sentence, language, ratio1=0.2, fname= None, storeCSV = False):
    df1 = read_transcript_Dataframe(video_id)
    raw_transcript = read_transcript_str(df1)
    if storeCSV == True:
        store_transcript_CSV(fname, video_id)
    if model == "Luhn":
        summary_result = run_Luhn(raw_transcript, language, num_sentence)
    # elif model == "Bert":
    #    summary_result = run_bert_extractive(raw_transcript, num_sentence)
    else:
        summary_result = run_textRank(raw_transcript, ratio1)

    return summary_result


if __name__ == "__main__":
    video_id = str(sys.argv[1])
    model = "Luhn"
    num_sentence = 10
    ratio1 = 0.2
    language = 'english'
    summary = main(video_id, model, num_sentence, language, ratio1)
    str = "\n".join(summary)
    print(str, flush=True, end='')
    # print(len(summary), type(summary))







