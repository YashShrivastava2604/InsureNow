from sentence_transformers import SentenceTransformer
import faiss
import pickle
import numpy as np

model = SentenceTransformer("BAAI/bge-base-en-v1.5")

index = faiss.read_index("rag/vector_store.faiss")

with open("rag/chunks.pkl", "rb") as f:
    chunks = pickle.load(f)


def retrieve(query, k=3):

    q_embed = model.encode([query])

    distances, indices = index.search(np.array(q_embed), k)

    results = [chunks[i] for i in indices[0]]

    return results